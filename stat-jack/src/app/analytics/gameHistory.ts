import { RoundRecord, ShoeRecord, LosingStreak } from './analytics-models'

export class GameHistory {
  roundHistory: RoundRecord[] = [];
  shoeHistory: ShoeRecord[] = [];
  activeRound: RoundRecord;
  activeShoe: ShoeRecord

  constructor() {}

  startRoundData(id: string) {
    this.activeRound = new RoundRecord(id);
  }

  startShoeData() {
    this.activeShoe = null
  }

  completeRoundData(): void {
    this.roundHistory.push(this.activeRound);
  }

  completeShoeData(shoe: ShoeRecord): void {
    this.shoeHistory.push({ ...this.activeShoe });
  }

  getPlayerNames(): string[] {
    return this.roundHistory[0].players.map(p => p.handle);
  }

  getRoundOfPlayersWinnings(round: RoundRecord): number {
    let amount: number = 0;
    round.players.forEach(p => amount += (p.endingBankroll - p.startingBankroll));
    return amount;
  }

  getRoundOfPlayersTotalBet(round: RoundRecord): number {
    let amount: number = 0;
    round.players.forEach(p => amount += p.totalBetThisHand);
    return amount;
  }

  getLastShoeId():number {
    return parseInt(this.roundHistory.reverse()[0].roundId.split('-')[0]);
  }

  convertToPercentRoundToHundredth(num: number): number {
    return Math.round(num * 10000) / 100
  }

  roundToHundredth(num: number): number {
    return Math.round(num * 100) / 100
  }

  getMaxNumberOfRoundsInADataSet() {
    let maxHandsInAShoe: number = 0;
    this.roundHistory.forEach(r => maxHandsInAShoe = r.handOfShoe > maxHandsInAShoe 
      ? r.handOfShoe 
      : maxHandsInAShoe
    );
    return maxHandsInAShoe;
  }

  getShoesLowestCountByShoeId(shoeId): number {
    let lowest = 0;
    const roundHistory = this.roundHistory.filter(r => r.shoeId === shoeId);
    roundHistory.forEach(r => lowest = r.beginningTrueCount < lowest ? r.beginningTrueCount : lowest);
    return lowest;
  }

  getShoesHighestCountByShoeId(shoeId): number {
    let highest = 0;
    const roundHistory = this.roundHistory.filter(r => r.shoeId === shoeId);
    roundHistory.forEach(r => highest = r.beginningTrueCount > highest ? r.beginningTrueCount : highest);
    return highest;
  }

  tableDataByCount(roundHistory: RoundRecord[] = null) {
    let byCountObj = {};
    const history = roundHistory ? roundHistory : this.roundHistory;  

    history.forEach(round => {
      if(!byCountObj[round.beginningTrueCount.toString()]) {
        byCountObj[round.beginningTrueCount.toString()] = { instances: 0, totalBet: 0, totalWon: 0}
      }
      byCountObj[round.beginningTrueCount.toString()].instances++;
      byCountObj[round.beginningTrueCount.toString()].totalBet += this.getRoundOfPlayersTotalBet(round);
      byCountObj[round.beginningTrueCount.toString()].totalWon += this.getRoundOfPlayersWinnings(round);
    })
    return byCountObj;
  }

  playerDataByCount(handle: string, roundHistory: RoundRecord[] = null) {
    let byCountObj = {};
    const history = roundHistory 
      ? roundHistory.map(r => {
          const players = r.players.filter(p => p.handle === handle)
          return { ...r, players };
        })
      : this.roundHistory.map(r => {
          const players = r.players.filter(p => p.handle === handle)
          return { ...r, players };
        });
        
    history.forEach(round => {
      if(!byCountObj[round.beginningTrueCount.toString()]) {
        byCountObj[round.beginningTrueCount.toString()] = { instances: 0, totalBet: 0, totalWon: 0}
      }
      byCountObj[round.beginningTrueCount.toString()].instances++;
      byCountObj[round.beginningTrueCount.toString()].totalBet += this.getRoundOfPlayersTotalBet(round);
      byCountObj[round.beginningTrueCount.toString()].totalWon += this.getRoundOfPlayersWinnings(round);
    })
    return byCountObj;
  }

  playerWinningsByCount(handle: string, roundHistory: RoundRecord[] = null) {
    // filter out all other players from table
    let byCountObj = {};
    const history = roundHistory 
      ? roundHistory.map(r => {
          const players = r.players.filter(p => p.handle === handle)
          return { ...r, players };
        })
      : this.roundHistory.map(r => {
          const players = r.players.filter(p => p.handle === handle)
          return { ...r, players };
        });
    history.forEach(round => {
      if(byCountObj[round.beginningTrueCount.toString()]) {
        byCountObj[round.beginningTrueCount.toString()].instances++;
        byCountObj[round.beginningTrueCount.toString()].amount += this.getRoundOfPlayersWinnings(round);
      } else {
        byCountObj[round.beginningTrueCount.toString()] = {
          instances: 1,
          amount: this.getRoundOfPlayersWinnings(round)
        }
      }
    })
    return byCountObj;
  }

  totalTableWinningsByCount(roundHistory: RoundRecord[] = null) {
    // Considering all rounds played, this will calculate the total table winning AMOUNT by count
    let byCountObj = {};
    const history = roundHistory ? roundHistory : this.roundHistory;
    history.forEach(round => {
      if(byCountObj[round.beginningTrueCount.toString()]) {
        byCountObj[round.beginningTrueCount.toString()].instances++;
        byCountObj[round.beginningTrueCount.toString()].amount += this.getRoundOfPlayersWinnings(round);
      } else {
        byCountObj[round.beginningTrueCount.toString()] = {
          instances: 1,
          amount: this.getRoundOfPlayersWinnings(round)
        }
      }
    })
    return byCountObj;
  }

  averageTableWinningsByCount() {
    // Considering all rounds played, this will calculate the average table winning AMOUNT per count
    let totabByCountObj = this.totalTableWinningsByCount();
    let averageByCount = {};
    Object.keys(totabByCountObj).forEach(key => averageByCount[key] = {
      instances: totabByCountObj[key].instances,
      amount: totabByCountObj[key].amount / totabByCountObj[key].instances
    })
    return averageByCount;
  }

  tableROIByCount() {
  // returns the overall percentage of money loss/won at each count  
    let byCountObj = {};
    this.roundHistory.forEach(round => {
      if(byCountObj[round.beginningTrueCount.toString()]) {
        byCountObj[round.beginningTrueCount.toString()].instances++;
        byCountObj[round.beginningTrueCount.toString()].totalBet += this.getRoundOfPlayersTotalBet(round);
        byCountObj[round.beginningTrueCount.toString()].totalWon += this.getRoundOfPlayersWinnings(round);
      } else {
        byCountObj[round.beginningTrueCount.toString()] = {
          instances: 1,
          totalBet: this.getRoundOfPlayersTotalBet(round),
          totalWon: this.getRoundOfPlayersWinnings(round),
        }
      }
    })
    return byCountObj;
  }

  resultsByCountAtEachRoundOfShoe() {
    const maxRounds = this.getMaxNumberOfRoundsInADataSet();
    const lastShoeId = this.getLastShoeId();
    let obj = {};
    this.roundHistory.forEach(round => {
      const roundId =  parseInt(round.roundId.split('-')[1]);
      if(!obj[roundId]) {
        obj[roundId] = {}
      }
      if(!obj[roundId][round.beginningTrueCount]){
        obj[roundId][round.beginningTrueCount] = { instances: 0, totalBet: 0, totalWon: 0}
      }
      obj[roundId][round.beginningTrueCount].instances++;
      obj[roundId][round.beginningTrueCount].totalBet += this.getRoundOfPlayersTotalBet(round);
      obj[roundId][round.beginningTrueCount].totalWon += this.getRoundOfPlayersWinnings(round);
      obj[roundId][round.beginningTrueCount].averageWinning = 
        this.roundToHundredth(obj[roundId][round.beginningTrueCount].totalWon / obj[roundId][round.beginningTrueCount].instances);
      obj[roundId][round.beginningTrueCount].edgePercentage = 
        this.convertToPercentRoundToHundredth(obj[roundId][round.beginningTrueCount].totalWon / obj[roundId][round.beginningTrueCount].totalBet)
    }) 
    console.log(obj);
    return obj; 
  }

  getLosingStreaksByPlayer(handle: string) :LosingStreak[] {
    console.log('+++++++++++++', 'getLosingStreaksByPlayer', '+++++++++++++');
    let streak: LosingStreak;
    let streaks: LosingStreak[] = [];
    let isOpen: boolean = false;
    const playerHistory = this.roundHistory
      .map(r => r.players.find(p => p.handle === handle))
      .map(({ startingBankroll, endingBankroll }) => ({ startingBankroll, endingBankroll }));
    playerHistory.reverse().forEach(({ startingBankroll, endingBankroll }) => {
      if(!isOpen && startingBankroll > endingBankroll) {
        streak = new LosingStreak();
        streak.previousHi = startingBankroll;
        streak.lowestPoint = endingBankroll;
        streak.roundsInBetween = 0;
        isOpen = true;
      } else if(isOpen && endingBankroll > streak.previousHi) {
        streak.newHi = endingBankroll;
        if(streak.roundsInBetween > 0) {
          streaks.push({ ...streak });
        }
        isOpen = false;
      } else if(isOpen) {
        streak.roundsInBetween++;
        streak.lowestPoint = endingBankroll < streak.lowestPoint ? endingBankroll : streak.lowestPoint;
      }
    });
    console.log('streaks langer than 100', streaks.filter(s => s.roundsInBetween > 100).length);
    console.log('streaks langer than 500', streaks.filter(s => s.roundsInBetween > 500).length);
    console.log('streaks langer than 1000', streaks.filter(s => s.roundsInBetween > 1000).length);
    console.log('streaks langer than 2000', streaks.filter(s => s.roundsInBetween > 2000).length);
    console.log('streaks langer than 3000', streaks.filter(s => s.roundsInBetween > 3000).length);
    console.log('streaks langer than 4000', streaks.filter(s => s.roundsInBetween > 4000).length);
    console.log('streaks langer than 5000', streaks.filter(s => s.roundsInBetween > 5000).length);
    console.log('streaks langer than 6000', streaks.filter(s => s.roundsInBetween > 6000).length);
    console.log('streaks langer than 7000', streaks.filter(s => s.roundsInBetween > 7000).length);
    console.log('streaks langer than 8000', streaks.filter(s => s.roundsInBetween > 8000).length);
    console.log('streaks langer than 9000', streaks.filter(s => s.roundsInBetween > 9000).length);
    console.log('streaks langer than 10000', streaks.filter(s => s.roundsInBetween > 10000).length);
    console.log('streaks langer than 11000', streaks.filter(s => s.roundsInBetween > 11000).length);
    console.log('streaks langer than 12000', streaks.filter(s => s.roundsInBetween > 12000).length);
    console.log('streaks langer than 13000', streaks.filter(s => s.roundsInBetween > 13000).length);
    console.log('streaks langer than 14000', streaks.filter(s => s.roundsInBetween > 14000).length);
    console.log('streaks langer than 15000', streaks.filter(s => s.roundsInBetween > 15000).length);
    console.log('streaks langer than 16000', streaks.filter(s => s.roundsInBetween > 16000).length);
    console.log('streaks langer than 17000', streaks.filter(s => s.roundsInBetween > 17000).length);
    console.log('streaks langer than 18000', streaks.filter(s => s.roundsInBetween > 18000).length);
    console.log('streaks langer than 19000', streaks.filter(s => s.roundsInBetween > 19000).length);
    console.log('streaks langer than 20000', streaks.filter(s => s.roundsInBetween > 20000).length);
    console.log('streaks langer than 21000', streaks.filter(s => s.roundsInBetween > 21000).length);
    console.log('streaks langer than 22000', streaks.filter(s => s.roundsInBetween > 22000).length);
    console.log('streaks langer than 23000', streaks.filter(s => s.roundsInBetween > 23000).length);
    console.log('streaks langer than 24000', streaks.filter(s => s.roundsInBetween > 24000).length);
    console.log('streaks langer than 25000', streaks.filter(s => s.roundsInBetween > 25000).length);
    console.log('streaks langer than 26000', streaks.filter(s => s.roundsInBetween > 26000).length);
    console.log('streaks langer than 27000', streaks.filter(s => s.roundsInBetween > 27000).length);
    console.log('streaks langer than 28000', streaks.filter(s => s.roundsInBetween > 28000).length);
    console.log('streaks langer than 29000', streaks.filter(s => s.roundsInBetween > 29000).length);
    console.log('streaks langer than 30000', streaks.filter(s => s.roundsInBetween > 30000));
    if(isOpen) {
      console.log(streak)
    }
    return streaks;
  }

  getAceEffectWinningsAtCount(count: number) {
    let obj = {};
    this.roundHistory.filter(r => r.beginningTrueCount === count).forEach(r => {
      if(!obj[r.aceSideCount.toString()]) {
        obj[r.aceSideCount.toString()] = {
          instances: 0,
          amount: 0
        }
      }
      obj[r.aceSideCount.toString()].instances++;
      obj[r.aceSideCount.toString()].amount += this.getRoundOfPlayersWinnings(r);
    });
    return(obj);
  }

  getAceEffectAverageWinningsAtCount(count: number) {
    let obj = {};
    let averageObj = this.getAceEffectWinningsAtCount(count);
    Object.keys(averageObj).forEach(key => obj[key] = {
      instances: averageObj[key].instances,
      amount: averageObj[key].amount / averageObj[key].instances
    })
    return obj;
  }

  getAceEffectROIByCount(count: number) {
      let obj = {};
      this.roundHistory.filter(r => r.beginningTrueCount === count).forEach(r => {
        if(obj[r.aceSideCount.toString()]) {
          obj[r.aceSideCount.toString()].instances++;
          obj[r.aceSideCount.toString()].totalBet += this.getRoundOfPlayersTotalBet(r);
          obj[r.aceSideCount.toString()].totalWon += this.getRoundOfPlayersWinnings(r);
        } else {
          obj[r.aceSideCount.toString()] = {
            instances: 1,
            totalBet: this.getRoundOfPlayersTotalBet(r),
            totalWon: this.getRoundOfPlayersWinnings(r),
          }
        }
      })
      return obj;
    }

  displayFirstHandOfShoeOverallResults() {
    // Considering all rounds played, this will calculate how much the table won or lost on the first hand of the shoe.
  }

  displayFirstHandOfShoeResultsByCountAtEndOfHand() {
    // Considering all rounds played, this will calculate how much the table won or lost depending on and sorted by the running count at the end of the round.
  }

  getPlayersBankrollHistory(name: string): number[] {
    return this.roundHistory.map(r => r.players.find(p => p.handle === name).endingBankroll)
  }
}
