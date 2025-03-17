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
        // eventContent: function (arg) {
        //   // console.log('Arg este', arg);

        //   // Create time display
        //   let eventTime = document.createElement('span');
        //   eventTime.innerText = arg.timeText;

        //   // Create title
        //   let eventTitle = document.createElement('span');
        //   eventTitle.innerText = arg.event.title;
        //   // Create button
        //   let deleteButton = document.createElement('button');
        //   deleteButton.classList.add('event-delete-button');

        //   let imgIcon = document.createElement('img');
        //   imgIcon.src = `${deleteIcon}`;
        //   imgIcon.alt = 'delete button';
        //   imgIcon.width = 20;
        //   imgIcon.height = 20;

        //   deleteButton.appendChild(imgIcon);
        //   deleteButton.onclick = function () {
        //     let events = getEventsFromLocalStorage();
        //     let idEvent = arg.event._def.publicId;
        //     events = events.filter(event => event.id !== idEvent);
        //     saveEventsInLocalStorage(events);
        //     arg.event.remove();
        //   };

        //   let eventContainer = document.createElement('div');
        //   eventContainer.classList.add('event-container');
        //   eventContainer.appendChild(eventTime);
        //   eventContainer.appendChild(eventTitle);
        //   eventContainer.appendChild(deleteButton);
        //   eventContainer.style.backgroundColor = arg.backgroundColor;

        //   return { domNodes: [eventContainer] };
        // },
        // eventReceive: function (info) {
        //   console.log(info);
        //   console.log('From receive');
        //     const idEvent = info.draggedEl.dataset.id;
        //   const tasks = model.getTasksLocalStorage();
        //     const tasks = getTasksFromLocalS();
        //     let task = tasks.filter(task => task.id === idEvent);
        //     console.log(task);
        //     // let color = task[0].categoryColor;
        //     let color = task[0].backgroundColor;
        //     // info.event.setProp('backgroundColor', task.backgroundColor);
        //     info.event.setProp('backgroundColor', color);
        //     info.event.setProp('textColor', 'black');
        //     // get start and endEvent
        //     const startEvent = info.event._instance.range.start;
        //     let endEvent = info.event._instance.range.end;
        //     console.log(startEvent);
        //     console.log(endEvent);
        //     if (info.event._context.viewApi.type === 'dayGridMonth') {
        //       startEvent.setHours(8);
        //       endEvent = new Date(startEvent);
        //       endEvent.setHours(10);
        //     }
        //     console.log(startEvent);
        //     console.log(endEvent);
        //     newEventCalendar(idEvent, startEvent, endEvent);
        // },
        // eventDrop: function (info) {
        //   const idEventDrop = info.event._def.publicId;
        //   let events = getEventsFromLocalStorage();
        //   events.forEach(function (event) {
        //     if (event.id === idEventDrop) {
        //       event.start = info.event._instance.range.start;
        //       event.end = info.event._instance.range.end;
        //     }
        //   });
        //   saveEventsInLocalStorage(events);
        // },
        // eventResize: function (info) {
        //   console.log(info.event._instance.range.end);
        //   let events = getEventsFromLocalStorage();
        //   const idElement = info.event._def.publicId;
        //   events.forEach(event => {
        //     if (event.id === idElement)
        //       event.end = info.event._instance.range.end;
        //   });
        //   saveEventsInLocalStorage(events);
        // },
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
