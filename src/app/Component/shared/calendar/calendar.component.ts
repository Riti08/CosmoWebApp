import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  CalendarOptions,
  DateSelectArg,
  EventClickArg,
  EventApi,
  EventInput,
} from '@fullcalendar/angular';
import { AdminService } from 'src/app/Services/admin.service';
import { CalendarService } from 'src/app/Services/Calendar/calendar.service';
import { PatientService } from 'src/app/Services/patient.service';
import { INITIAL_EVENTS, createEventId } from '../../../models/event.utils';

export class EventMap {
  // public id: string,
  constructor(
    public publicId: string,
    public title: string,
    public date: string,
    public color: string
  ) {}
}

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
})
export class CalendarComponent implements OnInit {
  name!: string;
  date?: string;
  showModal!: boolean;
  ApproveModal!: boolean;
  AddAppointment!: boolean;
  checkDate: boolean = false;
  calendarVisible = false;
  listOfEvent: EventMap[] = [];
  value: EventMap[] = [];
  //Date
  selectdate?: string;
  minDate: any;

  //user
  AppointmentId?: string;

  constructor(
    private adminService: AdminService,
    private admim: CalendarService,
    private router: Router
  ) {
    var CurrentDate = new Date();
    this.minDate = CurrentDate;
  }

  ngOnInit() {
    //   switch (this.UserType) {
    //     case 'Patient':
    //       this.GlobalBookAppointment(this.UserType);
    //       break;
    //     case 'Nurse':
    //       this.GlobalBookAppointment(this.UserType);
    //       break;
    //     case 'Physician':
    //       this.GlobalBookAppointment(this.UserType);
    //       break;
    //     case 'Admin':
    //       this.GlobalBookAppointment(this.UserType);
    //       break;
    //     default:
    //       alert('No such day exists!');
    //       break;
    //   }
    // }

    this.adminService
      .GetListofData()
      .subscribe((x) => {
        this.listOfEvent.push(...x);
        for (var i = 0; i < this.listOfEvent.length; i++) {
          var title = this.listOfEvent[i].title;
          var start = DateType(this.listOfEvent[i].date);
          this.value.push({
            publicId: this.listOfEvent[i].publicId,
            title: this.listOfEvent[i].title,
            date: this.listOfEvent[i].date,
            color: this.listOfEvent[i].color,
          });
        }
      })
      .add(() => {
        if (this.value.length > 0) {
          this.calendarVisible = true;
        }
      });

    function DateType(date: any): Date {
      var convertDate = new Date(date);

      return convertDate;
    }
  }

  calendarOptions: CalendarOptions = {
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
    },
    initialView: 'dayGridMonth',
    initialEvents: INITIAL_EVENTS, // alternatively, use the `events` setting to fetch from a feed
    weekends: true,
    editable: false,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this),
    height: 500,
    aspectRatio: 1.5,
    scrollTime: '00:00',
    events: this.value,
    // events: [
    //   {
    //     title: 'event 2',
    //     date: '2021-12-04 13:15:30',
    //     color: 'blue',
    //     id: '1234',
    //   },
    // ],
  };

  handleDateClick(arg: any) {
    alert('date click! ' + arg.dateStr);
  }

  currentEvents: EventApi[] = [];

  handleCalendarToggle() {
    this.calendarVisible = !this.calendarVisible;
  }

  handleWeekendsToggle() {
    const { calendarOptions } = this;
    calendarOptions.weekends = !calendarOptions.weekends;
  }

  handleDateSelect(selectInfo: DateSelectArg) {
    this.selectdate = selectInfo.startStr;
    if (new Date(this.selectdate) < this.minDate) {
      this.checkDate = true;
    } else {
      this.AddAppointment = true;
    }
  }

  handleEventClick(clickInfo: EventClickArg) {
    this.name = clickInfo.event.title;
    var dateparms = clickInfo.event._instance?.range.start;
    var ID = clickInfo.event._def?.publicId;
    this.AppointmentId = clickInfo.event._def?.extendedProps['publicId'];
    var date = dateparms?.toDateString();
    var time = dateparms?.toTimeString();
    var color = clickInfo.event._def?.ui.backgroundColor;
    this.date = date;
    if (color == 'red') {
      this.ApproveModal = true;
    } else {
      this.showModal = true;
    }
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents = events;
  }
  hide() {
    this.showModal = false;
  }

  ApproveReject(Type: string) {
    // alert(Type);
    // alert(this.AppointmentId);

    var AppointmentID = this.AppointmentId?.toString();

    this.admim
      .ApproveReject(AppointmentID, Type)
      .then((response) => response.text())
      .then((result) => {
        if (result == 'Success') {
          window.location.reload();
        }
      })
      .catch((error) => console.log('error', error));

    //this.ApproveModal = false;
  }

  ApproveRejectClose() {
    this.ApproveModal = false;
  }
  AddAppointmentClose() {
    this.AddAppointment = false;
  }
  checkDateClose() {
    this.checkDate = false;
  }
  CreateAppointment() {
    this.router.navigate(['/BookAppointment/Patient']);
  }
}
