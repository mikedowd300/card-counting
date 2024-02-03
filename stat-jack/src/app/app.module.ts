import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { ModalComponent } from './components/modal/modal.component';
import { ConditionsMakerComponent } from './components/modal/modal-content/conditions-maker/conditions-maker.component';
import { PlayerMakerComponent } from './components/modal/modal-content/player-maker/player-maker.component';
import { TableMakerComponent } from './components/modal/modal-content/table-maker/table-maker.component';
import { CanDoubleOnComponent } from './components/can-double-on/can-double-on.component';
import { DataCollectorComponent } from './components/modal/modal-content/data-collector/data-collector.component';
import { PlayStrategyChartMakerComponent } from './components/modal/modal-content/play-strategy-chart-maker/play-strategy-chart-maker.component';
import { SurrenderChartMakerComponent } from './components/modal/modal-content/surrender-chart-maker/surrender-chart-maker.component';
import { BetSpreadChartMakerComponent } from './components/modal/modal-content/bet-spread-chart-maker/bet-spread-chart-maker.component';
import { InsuranceStrategyComponent } from './components/modal/modal-content/insurance/insurance-strategy.component';
import { UnitResizingComponent } from './components/modal/modal-content/unit-resizing/unit-resizing.component';
import { WongingComponent } from './components/modal/modal-content/wonging/wonging.component';
import { TippingComponent } from './components/modal/modal-content/tipping/tipping.component';

@NgModule({
  declarations: [
    AppComponent,
    BetSpreadChartMakerComponent,
    CanDoubleOnComponent,
    ConditionsMakerComponent,
    DataCollectorComponent,
    FooterComponent,
    HeaderComponent,
    InsuranceStrategyComponent,
    LandingPageComponent,
    ModalComponent,
    PlayerMakerComponent,
    PlayStrategyChartMakerComponent,
    SurrenderChartMakerComponent,
    TableMakerComponent,
    TippingComponent,
    UnitResizingComponent,
    WongingComponent,
  ],
  imports: [ BrowserModule, FormsModule ],
  providers: [ ],
  bootstrap: [AppComponent]
})
export class AppModule { }
