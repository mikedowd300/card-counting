import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BustBonusService {

  bustData = {
    '10': {},
    '9': {},
    '8': {},
    '7': {},
    '6': {},
    '5': {},
    '4': {},
    '3': {},
    '2': {},
    '1': {},
  };

  constructor() {}

  // It looks like this side bet is not worth it, even with counting, however I don't want to erase it altogether. For now, it is just commented out.

  updateBustData(cardKey: string, count: string, bustInc: number): void {
    // if(!this.bustData[cardKey][count]) {
    //   this.bustData[cardKey][count] = { instances: 0, busts: 0}
    // }
    // this.bustData[cardKey][count].instances++;
    // this.bustData[cardKey][count].busts += bustInc;
  }

  logBustData() {
  //   console.log('BUST BONUS ANALYSIS');
  //   Object.keys(this.bustData).forEach(crdKey => {
  //     console.log('++++++++++++++', crdKey, '++++++++++++++++++');
  //     Object.keys(this.bustData[crdKey]).forEach(cntKey => {
  //       const busts = this.bustData[crdKey][cntKey].busts;
  //       const instances = this.bustData[crdKey][cntKey].instances;
  //       const bustRate = Math.round((busts * 10000) / instances) / 100;
  //       if(instances > 100) {
  //         console.log(` At TC ${cntKey} / instances: ${instances} / busts: ${busts} / bustRate: ${bustRate}%`);
  //       }
  //     });
  //     console.log();
  //   })
  }
}