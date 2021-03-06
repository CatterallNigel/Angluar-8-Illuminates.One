import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Logger} from '../../../utilities/logger';
import {ActionEvents} from '../../../models/common-model';
import {WidgetService} from '../../../services/widget.service';
import {WidgetConstants} from '../../../config/widget-constants';

@Component({
  selector: 'app-sign-out',
  templateUrl: './sign-out.component.html',
  styleUrls: ['./sign-out.component.less']
})
export class SignOutComponent implements OnInit {

  // Logour Images for Rollover
  logoutWhite: string = WidgetConstants.logoutImageWhite;
  logoutBlack: string = WidgetConstants.logoutImageBlack;
  logoutImage: string = this.logoutWhite;

  @Output() doAction = new EventEmitter<ActionEvents>();

  constructor(private ws: WidgetService) { }

  ngOnInit() {
  }

  changeLogoutImage() {
    switch (this.logoutImage) {
      case this.logoutBlack:
        this.logoutImage = this.logoutWhite;
        break;
      case this.logoutWhite:
        this.logoutImage = this.logoutBlack;
        break;
    }
  }

  async signOut() {
    await this.ws.modal.alertUser(this.ws.modalSignOutConfig, WidgetConstants.signOutMessage).then( success => {
      Logger.log('Sign-out response: ' + success, 'SignOutComponent.signOut', 39);
      if (success === 'action') {
        Logger.log('Signing out ..... ', 'SignOutComponent.signOut', 41);
        this.ws.action.signOutApp().then( reply => {
            this.ws.modal.alertUser(this.ws.modalSignOutResponseConfig, reply).then( () => {
                this.doAction.emit(ActionEvents.SIGNED_OUT);
            });
          },
          error => {
            this.ws.modal.alertUser(this.ws.modalSignOutResponseConfig, error);
          });
      } else {
        Logger.log('Sign-out  CANCELLED', 'SignOutComponent.signOut', 51);
        return;
      }
    });
  }
}
