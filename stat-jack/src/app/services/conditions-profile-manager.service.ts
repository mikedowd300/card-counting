import { Injectable } from '@angular/core';
import { 
  TableConditions, 
  DisplayTypeEnum, 
  PayRatioEnum, 
  StoredTableConditions, 
  SurrenderTypesEnum, 
  HoleCardTypesEnum
} from './../models/models';
import { LocalStorageService } from './local-storage.service';

// BGE = Blackjack Game Engine

@Injectable({
  providedIn: 'root'
})
export class ConditionsProfileManagerService {

  // This is the service for creating, editing and deleting new TableCondition Configurations.
  // 1) StoredTableConditions is what is stored in local storgae, it is an abbreviated set of table conditions, it only contains values that are dynamic
  // 1 - A) The shape of StoredTableConditions is the same basic shape as TableConditions, but without that classes static properties.
  // 1 - b) StoredTableConditions calue's types must match the corresponding types in TableConditions
  // 2) TableConditions is a the class type of the tableConditions property af a Table.
  // 3) defaultStoredTableConditions is the only hardcoded version of StoredTableConditions. If no other version exists in local storage, this will still (and always) exist as a possible value.
  // 4) hydrateTableConditions() this takes a StoredTableConditions value and creates a TableConditions value from it.

  defaultStoredTableConditions: StoredTableConditions = {
    title: 'Default Table Conditions',
    SI7: { value: false },
    RSA: { value: false },
    HSA: { value: false },
    DSA: { value: false },
    DA2: {
      value: true,
      canOnlyDoubleOn : {
        hard7: { value: true },
        hard8: { value: true },
        hard9: { value: true },
        hard10: { value: true },
        hard11: { value: true },
        hard12: { value: true },
        hard13: { value: true },
        AA: { value: true },
        A2: { value: true },
        A3: { value: true },
        A4: { value: true },
        A5: { value: true },
        A6: { value: true },
        A7: { value: true },
        A8: { value: true },
        A9: { value: true },
        // AT: { value: true },
      },
      DS21: { value: true },
      DS21A: { value: true },
    },
    ALE: { value: true },
    AHMR: { value: false },
    DFL: { value: true },
    DAS: { value: true },
    reshuffleOnDealerChange: { value: false },
    payRatio: { value: PayRatioEnum.THREE_to_TWO },
    surrender: { value: SurrenderTypesEnum.NO_SURRENDER },
    spotsPerTable: { value: 7 },
    decksPerShoe: { value: 2 },
    cardsBurnedPerShoe: { value: 1 },
    minBet: { value: 10 },
    maxBet: { value: 500 },
    shufflePoint: { value: .75 },
    handsPerDealer: { value: 100 },
    holeCardType: { value: HoleCardTypesEnum.STANDARD },
    MHFS: { value: 4 },
  };

  public defaultConditionsTemplate: TableConditions = {
    title: '',
    SI7: {
      description: 'Dealer stays on soft 17',
      displayWith: DisplayTypeEnum.CHECK_BOX,
      value: null,
    },
    RSA: {
      description: 'Player may resplit aces',
      displayWith: DisplayTypeEnum.CHECK_BOX,
      value: null,
    },
    HSA: {
      description: 'Player may hit split aces',
      displayWith: DisplayTypeEnum.CHECK_BOX,
      value: null,
    },
    DSA: {
      description: 'Player may double split aces',
      displayWith: DisplayTypeEnum.CHECK_BOX,
      value: null,
    },
    DA2: {
      description: 'Player may double any 2 cards',
      displayWith: DisplayTypeEnum.CHECK_BOX,
      value: null,
      expandsWhenFalse: true,
      DS21: {
        description: 'Allow double a soft 21 after splitting tens',
        displayWith: DisplayTypeEnum.CHECK_BOX,
        value: null,
      },
      DS21A: {
        description: 'Allow double a soft 21 after splitting aces',
        displayWith: DisplayTypeEnum.CHECK_BOX,
        value: null,
      }, 
      canOnlyDoubleOn : { // Dont show if DA2.value is true
        hard7: { 
          description: "hard 7", 
          displayWith: DisplayTypeEnum.CHECK_BOX, 
          value: null 
        },
        hard8: { 
          description: "hard 8", 
          displayWith: DisplayTypeEnum.CHECK_BOX, 
          value: null 
        },
        hard9: { 
          description: "hard 9", 
          displayWith: DisplayTypeEnum.CHECK_BOX, 
          value: null 
        },
        hard10: { 
          description: "hard 10", 
          displayWith: DisplayTypeEnum.CHECK_BOX, 
          value: null 
        },
        hard11: { 
          description: "hard 11", 
          displayWith: DisplayTypeEnum.CHECK_BOX, 
          value: null 
        },
        hard12: { 
          description: "hard 12", 
          displayWith: DisplayTypeEnum.CHECK_BOX, 
          value: null 
        },
        hard13: { 
          description: "hard 13", 
          displayWith: DisplayTypeEnum.CHECK_BOX, 
          value: null 
        },
        AA: { 
          description: "Ace Ace", 
          displayWith: DisplayTypeEnum.CHECK_BOX, 
          value: null 
        },
        A2: { 
          description: "Ace 2", 
          displayWith: DisplayTypeEnum.CHECK_BOX, 
          value: null 
        },
        A3: { 
          description: "Ace 3", 
          displayWith: DisplayTypeEnum.CHECK_BOX, 
          value: null 
        },
        A4: { 
          description: "Ace 4", 
          displayWith: DisplayTypeEnum.CHECK_BOX, 
          value: null 
        },
        A5: { 
          description: "Ace 5", 
          displayWith: DisplayTypeEnum.CHECK_BOX, 
          value: null 
        },
        A6: { 
          description: "Ace 6", 
          displayWith: DisplayTypeEnum.CHECK_BOX, 
          value: null 
        },
        A7: { 
          description: "Ace 7", 
          displayWith: DisplayTypeEnum.CHECK_BOX, 
          value: null 
        },
        A8: { 
          description: "Ace 8", 
          displayWith: DisplayTypeEnum.CHECK_BOX, 
          value: null 
        },
        A9: { 
          description: "Ace 9", 
          displayWith: DisplayTypeEnum.CHECK_BOX, 
          value: null 
        },
        // AT: {
        //   description: "Ace Ten, after split",
        //   displayWith: DisplayTypeEnum.CHECK_BOX, 
        //   value: null 
        // }
      }
    },
    DFL: { 
      description: 'Player may double for less',
      displayWith: DisplayTypeEnum.CHECK_BOX,
      value: null,
    },
    DAS: {
      description: 'Player may double after splitting',
      displayWith: DisplayTypeEnum.CHECK_BOX,
      value: null,
    },
    reshuffleOnDealerChange: {
      description: 'A new dealer will shuffle when joining the table',
      displayWith: DisplayTypeEnum.CHECK_BOX,
      value: null,
    },
    ALE: {
      description: 'Allow mid-shoe entry',
      displayWith: DisplayTypeEnum.CHECK_BOX,
      value: null,
    },
    AHMR: {
      description: 'Additional hands increase the minimum bet to number of hands * table minimum',
      displayWith: DisplayTypeEnum.CHECK_BOX,
      value: null,
    },
    payRatio: {
      description: 'Blackjack pays:',
      displayWith: DisplayTypeEnum.RADIO_BUTTON,
      value: null,
      options: [
        PayRatioEnum.ONE_to_ONE, 
        PayRatioEnum.SIX_to_FIVE, 
        PayRatioEnum.THREE_to_TWO,
        PayRatioEnum.TWO_to_ONE,
      ],
    }, // This needs to be initialized with code so it can be dynamic
    surrender: {
      description: "Surrender rule",
      displayWith: DisplayTypeEnum.RADIO_BUTTON,
      value: null,
      options: [
        SurrenderTypesEnum.EARLY_AGAINST_ANY,
        SurrenderTypesEnum.EARLY_AGAINST_10_DOWN,  
        SurrenderTypesEnum.LATE, 
        SurrenderTypesEnum.NO_SURRENDER,
      ],
    },
    holeCardType: {
      description: 'Hole card rules',
      displayWith: DisplayTypeEnum.RADIO_BUTTON,
      value: null,
      options: [
        HoleCardTypesEnum.STANDARD,
        HoleCardTypesEnum.OBO,
        HoleCardTypesEnum.ENHC
      ],
    },
    MHFS: {
      description: 'Maximum hands from a split',
      displayWith: DisplayTypeEnum.TEXT,
      value: null,
    },
    spotsPerTable: {
      description: 'Spots per table',
      displayWith: DisplayTypeEnum.TEXT,
      value: null,
    },
    decksPerShoe: {
      description: 'Decks per shoe',
      displayWith: DisplayTypeEnum.TEXT,
      value: null,
    }, 
    cardsBurnedPerShoe: {
      description: 'Cards burned per shoe',
      displayWith: DisplayTypeEnum.TEXT,
      value: null,
    },
    minBet: {
      description: 'minimum bet',
      displayWith: DisplayTypeEnum.TEXT,
      value: null,
    },
    maxBet: {
      description: 'maximum bet',
      displayWith: DisplayTypeEnum.TEXT,
      value: null,
    },
    shufflePoint: {
      description: 'Cards are shuffled after this % of the cards have been dealt',
      displayWith: DisplayTypeEnum.TEXT,
      value: null,
    },
    handsPerDealer: {
      description: 'Dealers switchout after dealing this many hands ',
      displayWith: DisplayTypeEnum.TEXT,
      value: null,
    },
  };

  activeTableConditions: TableConditions;

  constructor(private localStorageService: LocalStorageService) {}

  hydrateTableConditions(sourceConfig: StoredTableConditions = this.defaultStoredTableConditions, title: string = "Default Table Conditions"): TableConditions {
    let tableConditions = { ... this.defaultConditionsTemplate };
    tableConditions.title = title;
    tableConditions.SI7.value = sourceConfig.SI7?.value || this.defaultStoredTableConditions.SI7.value;
    tableConditions.RSA.value = sourceConfig.RSA?.value || this.defaultStoredTableConditions.RSA.value;
    tableConditions.HSA.value = sourceConfig.HSA?.value || this.defaultStoredTableConditions.HSA.value;
    tableConditions.DSA.value = sourceConfig.DSA?.value || this.defaultStoredTableConditions.DSA.value;
    tableConditions.DFL.value = sourceConfig.DFL?.value || this.defaultStoredTableConditions.DFL.value;
    tableConditions.DAS.value = sourceConfig.DAS?.value || this.defaultStoredTableConditions.DAS.value;
    tableConditions.ALE.value = sourceConfig.ALE?.value || this.defaultStoredTableConditions.ALE.value;
    tableConditions.AHMR.value = sourceConfig.AHMR?.value || this.defaultStoredTableConditions.AHMR.value;
    tableConditions.DA2.value = sourceConfig.DA2?.value || this.defaultStoredTableConditions.DA2.value;
    tableConditions.DA2.canOnlyDoubleOn.hard7.value = sourceConfig.DA2.canOnlyDoubleOn.hard7?.value || this.defaultStoredTableConditions.DA2.canOnlyDoubleOn.hard7.value;
    tableConditions.DA2.canOnlyDoubleOn.hard8.value = sourceConfig.DA2.canOnlyDoubleOn.hard8?.value || this.defaultStoredTableConditions.DA2.canOnlyDoubleOn.hard8.value;
    tableConditions.DA2.canOnlyDoubleOn.hard9.value = sourceConfig.DA2.canOnlyDoubleOn.hard9?.value || this.defaultStoredTableConditions.DA2.canOnlyDoubleOn.hard9.value;
    tableConditions.DA2.canOnlyDoubleOn.hard10.value = sourceConfig.DA2.canOnlyDoubleOn.hard10?.value || this.defaultStoredTableConditions.DA2.canOnlyDoubleOn.hard10.value;
    tableConditions.DA2.canOnlyDoubleOn.hard11.value = sourceConfig.DA2.canOnlyDoubleOn.hard11?.value || this.defaultStoredTableConditions.DA2.canOnlyDoubleOn.hard11.value;
    tableConditions.DA2.canOnlyDoubleOn.hard12.value = sourceConfig.DA2.canOnlyDoubleOn.hard12?.value || this.defaultStoredTableConditions.DA2.canOnlyDoubleOn.hard12.value;
    tableConditions.DA2.canOnlyDoubleOn.hard13.value = sourceConfig.DA2.canOnlyDoubleOn.hard13?.value || this.defaultStoredTableConditions.DA2.canOnlyDoubleOn.hard13.value;
    tableConditions.DA2.canOnlyDoubleOn.AA.value = sourceConfig.DA2.canOnlyDoubleOn?.AA.value || this.defaultStoredTableConditions.DA2.canOnlyDoubleOn.AA.value;
    tableConditions.DA2.canOnlyDoubleOn.A2.value = sourceConfig.DA2.canOnlyDoubleOn?.A2.value || this.defaultStoredTableConditions.DA2.canOnlyDoubleOn.A2.value;
    tableConditions.DA2.canOnlyDoubleOn.A3.value = sourceConfig.DA2.canOnlyDoubleOn?.A3.value || this.defaultStoredTableConditions.DA2.canOnlyDoubleOn.A3.value;
    tableConditions.DA2.canOnlyDoubleOn.A4.value = sourceConfig.DA2.canOnlyDoubleOn?.A4.value || this.defaultStoredTableConditions.DA2.canOnlyDoubleOn.A4.value;
    tableConditions.DA2.canOnlyDoubleOn.A5.value = sourceConfig.DA2.canOnlyDoubleOn?.A5.value || this.defaultStoredTableConditions.DA2.canOnlyDoubleOn.A5.value;
    tableConditions.DA2.canOnlyDoubleOn.A6.value = sourceConfig.DA2.canOnlyDoubleOn?.A6.value || this.defaultStoredTableConditions.DA2.canOnlyDoubleOn.A6.value;
    tableConditions.DA2.canOnlyDoubleOn.A7.value = sourceConfig.DA2.canOnlyDoubleOn?.A7.value || this.defaultStoredTableConditions.DA2.canOnlyDoubleOn.A7.value;
    tableConditions.DA2.canOnlyDoubleOn.A8.value = sourceConfig.DA2.canOnlyDoubleOn?.A8.value || this.defaultStoredTableConditions.DA2.canOnlyDoubleOn.A8.value;
    tableConditions.DA2.canOnlyDoubleOn.A9.value = sourceConfig.DA2.canOnlyDoubleOn?.A9.value || this.defaultStoredTableConditions.DA2.canOnlyDoubleOn.A9.value ;
    // tableConditions.DA2.canOnlyDoubleOn.AT.value = sourceConfig.DA2.canOnlyDoubleOn?.AT.value || this.defaultStoredTableConditions.DA2.canOnlyDoubleOn.AT.value;
    tableConditions.DA2.DS21.value = sourceConfig.DA2.DS21?.value || this.defaultStoredTableConditions.DA2.DS21.value;
    tableConditions.DA2.DS21A.value = sourceConfig.DA2.DS21A?.value || this.defaultStoredTableConditions.DA2.DS21A.value;
    tableConditions.reshuffleOnDealerChange.value = sourceConfig.reshuffleOnDealerChange?.value || this.defaultStoredTableConditions.reshuffleOnDealerChange.value;
    tableConditions.payRatio.value = sourceConfig.payRatio?.value || this.defaultStoredTableConditions.payRatio.value;
    tableConditions.surrender.value = sourceConfig.surrender?.value || this.defaultStoredTableConditions.surrender.value;
    tableConditions.spotsPerTable.value = sourceConfig.spotsPerTable?.value || this.defaultStoredTableConditions.spotsPerTable.value;
    tableConditions.decksPerShoe.value = sourceConfig.decksPerShoe?.value || this.defaultStoredTableConditions.decksPerShoe.value;
    tableConditions.cardsBurnedPerShoe.value = sourceConfig.cardsBurnedPerShoe?.value || this.defaultStoredTableConditions.cardsBurnedPerShoe.value;
    tableConditions.minBet.value = sourceConfig.minBet?.value || this.defaultStoredTableConditions.minBet.value;
    tableConditions.maxBet.value = sourceConfig.maxBet?.value || this.defaultStoredTableConditions.maxBet.value;
    tableConditions.shufflePoint.value = sourceConfig.shufflePoint?.value || this.defaultStoredTableConditions.shufflePoint.value;
    tableConditions.handsPerDealer.value = sourceConfig.handsPerDealer?.value || this.defaultStoredTableConditions.handsPerDealer.value;
    tableConditions.holeCardType.value = sourceConfig.holeCardType?.value || this.defaultStoredTableConditions.holeCardType.value;
    tableConditions.MHFS.value = sourceConfig.MHFS?.value;

    return tableConditions;
  }

  createStoredTableConditionsObject(conditions: TableConditions): StoredTableConditions {
    return {
      title: conditions.title,
      SI7: { value: conditions.SI7.value as boolean },
      RSA: { value: conditions.RSA.value as boolean },
      HSA: { value: conditions.HSA.value as boolean },
      DSA: { value: conditions.DSA.value as boolean },
      DA2: {
        value: conditions.DA2.value as boolean,
        canOnlyDoubleOn : {
          hard7: { value: conditions.DA2.canOnlyDoubleOn.hard7.value as boolean },
          hard8: { value: conditions.DA2.canOnlyDoubleOn.hard8.value as boolean },
          hard9: { value: conditions.DA2.canOnlyDoubleOn.hard9.value as boolean },
          hard10: { value: conditions.DA2.canOnlyDoubleOn.hard10.value as boolean },
          hard11: { value: conditions.DA2.canOnlyDoubleOn.hard11.value as boolean },
          hard12: { value: conditions.DA2.canOnlyDoubleOn.hard12.value as boolean },
          hard13: { value: conditions.DA2.canOnlyDoubleOn.hard13.value as boolean },
          AA: { value: conditions.DA2.canOnlyDoubleOn.AA.value as boolean },
          A2: { value: conditions.DA2.canOnlyDoubleOn.A2.value as boolean },
          A3: { value: conditions.DA2.canOnlyDoubleOn.A3.value as boolean },
          A4: { value: conditions.DA2.canOnlyDoubleOn.A4.value as boolean },
          A5: { value: conditions.DA2.canOnlyDoubleOn.A5.value as boolean },
          A6: { value: conditions.DA2.canOnlyDoubleOn.A6.value as boolean },
          A7: { value: conditions.DA2.canOnlyDoubleOn.A7.value as boolean },
          A8: { value: conditions.DA2.canOnlyDoubleOn.A8.value as boolean },
          A9: { value: conditions.DA2.canOnlyDoubleOn.A9.value as boolean },
          // AT: { value: conditions.DA2.canOnlyDoubleOn.AT.value as boolean },
        },
        DS21: { value: conditions.DA2.DS21.value as boolean },
        DS21A: { value: conditions.DA2.DS21A.value as boolean },
      },
      ALE: { value: conditions.ALE.value as boolean  },
      AHMR: { value: conditions.AHMR.value as boolean  },
      DFL: { value: conditions.DFL.value as boolean  },
      DAS: { value: conditions.DAS.value as boolean  },
      reshuffleOnDealerChange: { value: conditions.reshuffleOnDealerChange.value as boolean  },
      payRatio: { value: conditions.payRatio.value as PayRatioEnum },
      surrender: { value: conditions.surrender.value as SurrenderTypesEnum },
      spotsPerTable: { value: conditions.spotsPerTable.value as number },
      decksPerShoe: { value: conditions.decksPerShoe.value as number },
      cardsBurnedPerShoe: { value: conditions.cardsBurnedPerShoe.value as number },
      minBet: { value: conditions.minBet.value as number },
      maxBet: { value: conditions.maxBet.value as number },
      shufflePoint: { value: conditions.shufflePoint.value as number },
      handsPerDealer: { value: conditions.handsPerDealer.value as number },
      holeCardType: { value: conditions.holeCardType.value as HoleCardTypesEnum }, 
      MHFS: { value: conditions.MHFS.value as number },
    }
  }

  setActiveTableConditions(conditions: TableConditions): void {
    this.activeTableConditions = { ...conditions };
  }

  getActiveConditions(): TableConditions {
    return this.activeTableConditions || this.hydrateTableConditions(this.defaultStoredTableConditions)
  }
}