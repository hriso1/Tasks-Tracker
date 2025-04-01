import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin, { Draggable } from '@fullcalendar/interaction';

class CalendarView {
  _parentElement = document.querySelector('.tasks-list');
  calendar;

  addCalendar(handler, events) {
    document.addEventListener('DOMContentLoaded', () => {
      //   const Calendar = FullCalendar.Calendar;
      //   const Draggable = FullCalendar.Draggable;

      const calendarEl = document.getElementById('calendar');

      var nowLocal = new Date();
      var nowUTC = new Date(
        nowLocal.getTime() - nowLocal.getTimezoneOffset() * 60000
      );

      /////////////////////////////// make tasks draggable

      new Draggable(this._parentElement, {
        itemSelector: '.task-container',
        eventData: function (eventElement) {
          return {
            title: eventElement.innerText,
          };
        },
      });

      /////////////////////////////// initiate the calendar

      this.calendar = new Calendar(calendarEl, {
        plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],
        timeZone: 'UTC',
        headerToolbar: {
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay',
        },
        initialView: 'timeGridWeek',
        editable: true,
        eventStartEditable: true,
        droppable: true,
        nowIndicator: true,
        now: nowUTC.toISOString(),
        // contentHeight: 760,
        // selectable: true,
        titleFormat: {
          month: 'long',
          year: 'numeric',
          day: 'numeric',
          weekday: 'long',
        },

        eventClick: function (info) {
          /////////////////////// Trebuie sa creez un pop up in care sa editez evenimentul si cu un buton de sters
          console.log(info);
        },

        events: events,
      });

      this.calendar.render();

      if (handler) handler(this.calendar);
    });
  }
}

export default new CalendarView();
