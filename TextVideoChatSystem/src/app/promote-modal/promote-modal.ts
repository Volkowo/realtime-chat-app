import { Component, Input } from '@angular/core';

@Component({
  selector: 'promote-modal',
  imports: [],
  templateUrl: './promote-modal.html',
  styleUrl: './promote-modal.css'
})
export class PromoteModal {
  @Input() userID: any;   // comes from parent
  @Input() checkGroupAdminRole!: (userID: any) => any[];
  @Input() checkUser!: (user: any, groupID: any, newRole: any) => void;
  @Input() getGroupById!: (groupID: string) => string;
}
