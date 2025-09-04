import { Component, Input } from '@angular/core';

@Component({
  selector: 'promote-modal',
  imports: [],
  templateUrl: './promote-modal.html',
  styleUrl: './promote-modal.css'
})
export class PromoteModal {
  @Input() user: any;   // comes from parent
  @Input() checkGroupAdminRole!: (user: any) => any[];
  @Input() checkUser!: (user: any, group: any, newRole: any) => void;
  @Input() getGroupById!: (groupID: string) => string;
}
