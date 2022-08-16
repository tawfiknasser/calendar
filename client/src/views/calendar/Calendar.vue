<template>
  <div>
    <v-sheet tile height="54" class="d-flex">
      <v-btn icon class="ma-2" @click="$refs.calendar.prev()">
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
      <v-select
        v-model="type"
        :items="types"
        dense
        outlined
        hide-details
        class="ma-2"
        label="type"
      ></v-select>
      <v-select
        v-model="mode"
        :items="modes"
        dense
        outlined
        hide-details
        label="event-overlap-mode"
        class="ma-2"
      ></v-select>
      <v-select
        v-model="weekday"
        :items="weekdays"
        dense
        outlined
        hide-details
        label="weekdays"
        class="ma-2"
      ></v-select>
      <v-spacer></v-spacer>
      <v-btn icon class="ma-2" @click="$refs.calendar.next()">
        <v-icon>mdi-chevron-right</v-icon>
      </v-btn>
    </v-sheet>
    <v-sheet height="600">
      <v-calendar
        ref="calendar"
        v-model="value"
        :weekdays="weekday"
        :type="type"
        :events="events"
        :event-overlap-mode="mode"
        :event-overlap-threshold="30"
        :event-color="getEventColor"
        @change="showEvents"
        @click:more="viewDay"
        @click:date="viewDay"
        @click:event="showEvent"
        @mousedown:event="startDrag"
        @mousedown:time="startTime"
        @mousemove:time="mouseMove"
        @mouseup:time="endDrag"
        @mousedown:day="startTime"
        @mousemove:day="mouseMove"
        @mouseup:day="endDrag"
        @mouseleave.native="cancelDrag"
      >
        <template v-slot:event="{ event, timed, eventSummary }">
          <div class="v-event-draggable" v-html="eventSummary()"></div>
          <div
            :class="timed ? 'v-event-drag-bottom' : 'v-event-drag-right'"
            @mousedown.stop="extendDrag(event)"
          ></div>
        </template>
      </v-calendar>

      <v-menu
        v-model="selectedOpen"
        :close-on-content-click="false"
        :activator="selectedElement"
        offset-x
      >
        <v-card color="grey lighten-4" min-width="350px" flat>
          <v-toolbar :color="selectedEvent.color" dark>
            <v-btn icon>
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-card-text>
            <span v-html="selectedEvent.details"></span>
          </v-card-text>
          <v-card-actions>
            <v-btn text color="secondary" @click="selectedOpen = false">
              Cancel
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-menu>
    </v-sheet>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import findOneFromEnd from '@/utils/findOneFromEnd';

export default {
  name: 'CalendarView',
  data: () => ({
    type: 'month',
    types: ['month', 'week', 'day', '4day'],
    mode: 'stack',
    modes: ['stack', 'column'],
    weekday: [0, 1, 2, 3, 4, 5, 6],
    weekdays: [
      { text: 'Sun - Sat', value: [0, 1, 2, 3, 4, 5, 6] },
      { text: 'Mon - Sun', value: [1, 2, 3, 4, 5, 6, 0] },
      { text: 'Mon - Fri', value: [1, 2, 3, 4, 5] },
      { text: 'Mon, Wed, Fri', value: [1, 3, 5] },
    ],
    value: new Date().toISOString().substr(0, 10), // opens on today date
    events: [],
    colors: [
      'blue',
      'indigo',
      'deep-purple',
      'cyan',
      'green',
      'orange',
      'grey darken-1',
    ],
    names: [
      'Meeting',
      'Holiday',
      'PTO',
      'Travel',
      'Event',
      'Birthday',
      'Conference',
      'Party',
    ],
    dragEvent: null,
    dragStart: null,
    createEvent: null,
    createStart: null,
    extendOriginal: null,
    selectedEvent: {},
    selectedElement: null,
    selectedOpen: false,
  }),
  mounted() {},
  methods: {
    ...mapActions(['getEvents', 'createEventAction', 'updateEvent']),
    viewDay({ date }) {
      this.focus = date;
      this.type = 'day';
    },
    showEvents({ start, end }) {
      const startRange = new Date(`${start.date}T00:00:00`);
      const endRange = new Date(`${end.date}T23:59:59`);
      this.getEvents({ startRange, endRange }).then((result) => {
        const events = result.data.map((event) => ({
          name: event.title,
          start: new Date(event.startDate),
          end: new Date(event.endDate),
          color: this.colors[this.rnd(0, this.colors.length - 1)],
          timed: !event.isFullDay,
          title: event.title,
          _UUID: event._UUID,
        }));

        this.events = events || [];
      });
    },
    getEventColor(event) {
      return event.color;
    },
    rnd(a, b) {
      return Math.floor((b - a + 1) * Math.random()) + a;
    },
    startDrag({ event }) {
      if (event) {
        this.dragEvent = event;
        this.dragTime = null;
        this.extendOriginal = null;
      }
    },
    startTime(tms) {
      const mouse = this.toTime(tms);
      if (this.dragEvent && this.dragTime === null) {
        const { start } = this.dragEvent;
        this.dragTime = mouse - start;
      } else if (this.type !== 'month') {
        const _tempID = Date.now();
        this.createStart = this.roundTime(mouse);
        this.createEvent = {
          name: `Event #${this.events.length}`,
          color: this.rndElement(this.colors),
          start: this.createStart,
          end: this.createStart,
          timed: true,
          _tempID,
        };

        this.createEventAction(this.createEvent).then((response) => {
          // append the UUID
          const createdEvent = findOneFromEnd(
            this.events,
            (event) => event._tempID === _tempID,
          );
          createdEvent._UUID = response.data._UUID;
        });
        // immediate update UI
        this.events.push(this.createEvent);
      }
    },
    extendDrag(event) {
      this.createEvent = event;
      this.createStart = event.start;
      this.extendOriginal = event.end;
    },
    mouseMove(tms) {
      const mouse = this.toTime(tms);
      if (this.dragEvent && this.dragTime !== null) {
        const { start } = this.dragEvent;
        const { end } = this.dragEvent;
        const duration = end - start;
        const newStartTime = mouse - this.dragTime;
        const newStart = this.roundTime(newStartTime);
        const newEnd = newStart + duration;
        this.dragEvent.start = newStart;
        this.dragEvent.end = newEnd;
        this.updateEvent(this.dragEvent);
      } else if (this.createEvent && this.createStart !== null) {
        const mouseRounded = this.roundTime(mouse, false);
        const min = Math.min(mouseRounded, this.createStart);
        const max = Math.max(mouseRounded, this.createStart);
        this.createEvent.start = min;
        this.createEvent.end = max;
      }
    },
    endDrag() {
      if (this.createEvent) this.updateEvent(this.createEvent);
      this.dragTime = null;
      this.dragEvent = null;
      this.createEvent = null;
      this.createStart = null;
      this.extendOriginal = null;
    },
    cancelDrag() {
      if (this.createEvent) {
        if (this.extendOriginal) {
          this.createEvent.end = this.extendOriginal;
        } else {
          const i = this.events.indexOf(this.createEvent);
          if (i !== -1) {
            this.events.splice(i, 1);
          }
        }
      }
      this.createEvent = null;
      this.createStart = null;
      this.dragTime = null;
      this.dragEvent = null;
    },
    roundTime(time, down = true) {
      const roundTo = 15; // minutes
      const roundDownTime = roundTo * 60 * 1000;
      return down
        ? time - (time % roundDownTime)
        : time + (roundDownTime - (time % roundDownTime));
    },
    toTime(tms) {
      return new Date(
        tms.year,
        tms.month - 1,
        tms.day,
        tms.hour,
        tms.minute,
      ).getTime();
    },
    rndElement(arr) {
      return arr[this.rnd(0, arr.length - 1)];
    },
    showEvent({ nativeEvent, event }) {
      const open = () => {
        this.selectedEvent = event;
        this.selectedElement = nativeEvent.target;
        requestAnimationFrame(() => requestAnimationFrame(() => (this.selectedOpen = true)));
      };
      if (this.selectedOpen) {
        this.selectedOpen = false;
        requestAnimationFrame(() => requestAnimationFrame(() => open()));
      } else {
        open();
      }
      nativeEvent.stopPropagation();
    },
  },
};
</script>

<style scoped lang="scss">
.v-event-draggable {
  padding-left: 6px;
}
.v-event-timed {
  user-select: none;
  -webkit-user-select: none;
}
.v-event-drag-right {
  position: absolute;
  left: 0;
  right: 10px;
  bottom: 4px;
  height: 4px;
  cursor: ew-resize;
  &::after {
    display: none;
    position: absolute;
    left: 100%;
    bottom: 50%;
    height: 5px;
    border-top: 1px solid white;
    border-bottom: 1px solid white;
    width: 116px;
    margin-left: -8px;
    opacity: 0.8;
    content: "";
  }
  &:hover::after {
    display: block;
  }
}
.v-event-drag-bottom {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 4px;
  height: 4px;
  cursor: ns-resize;
  &::after {
    display: none;
    position: absolute;
    left: 50%;
    height: 4px;
    border-top: 1px solid white;
    border-bottom: 1px solid white;
    width: 16px;
    margin-left: -8px;
    opacity: 0.8;
    content: "";
  }
  &:hover::after {
    display: block;
  }
}
</style>
