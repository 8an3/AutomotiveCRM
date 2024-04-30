import React, { Component, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";

import storeHoursCss from "~/styles/storeHours.css";
import styles1 from "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import styles2 from "react-big-calendar/lib/css/react-big-calendar.css";
import { type LinksFunction } from "@remix-run/node";
import { datetime, RRule, type Weekday, rrulestr } from 'rrule'

const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles1 },
  { rel: "stylesheet", href: styles2 },
  { rel: "stylesheet", href: storeHoursCss },
];


export default function FollowUpApt() {
  const MO = new RRule({
    freq: RRule.WEEKLY,
    interval: 1,
    byweekday: [RRule.MO],
    dtstart: datetime(2023, 4, 29, 9, 0o0),
    until: datetime(2023, 4, 29, 15, 30),
  })
  const TU = new RRule({
    freq: RRule.WEEKLY,
    interval: 1,
    byweekday: [RRule.TU],
    dtstart: datetime(2023, 4, 30, 9, 0o0),
    until: datetime(2023, 4, 30, 15, 30),
  })
  const WE = new RRule({
    freq: RRule.WEEKLY,
    interval: 1,
    byweekday: [RRule.WE],
    dtstart: datetime(2023, 5, 1, 9, 0o0),
    until: datetime(2023, 5, 1, 15, 30),
  })
  const TH = new RRule({
    freq: RRule.WEEKLY,
    interval: 1,
    byweekday: [RRule.TH],
    dtstart: datetime(2023, 5, 2, 9, 0o0),
    until: datetime(2023, 5, 2, 15, 30),
  })
  const FR = new RRule({
    freq: RRule.WEEKLY,
    interval: 1,
    byweekday: [RRule.FR],
    dtstart: datetime(2023, 5, 3, 9, 0o0),
    until: datetime(2023, 5, 3, 15, 30),
  })
  const SA = new RRule({
    freq: RRule.WEEKLY,
    interval: 1,
    byweekday: [RRule.SA],
    dtstart: datetime(2023, 5, 4, 9, 0o0),
    until: datetime(2023, 5, 4, 15, 30),
  })
  const SU = new RRule({
    freq: RRule.WEEKLY,
    interval: 1,
    byweekday: [RRule.SU],
    dtstart: datetime(2023, 5, 5, 9, 0o0),
    until: datetime(2023, 5, 5, 15, 30),
  })
  const events = [MO, TU, WE, TH, FR, SA, SU];


  console.log('Generated Events:', events); // Log generated events for debugging

  const onEventResize = (data) => {
    const { start, end } = data;

    setState((state) => {
      state.events[0].start = start;
      state.events[0].end = end;
      return { events: [...state.events] };
    });
  };

  const onEventDrop = (data) => {
    console.log(data);
  };
  const [state, setState] = useState(events)


  return (
    <div className="App">
      <DnDCalendar
        defaultDate={moment().toDate()}
        defaultView="week"
        events={state}

        localizer={localizer}
        onEventDrop={onEventDrop}
        onEventResize={onEventResize}
        resizable
        style={{ height: "100vh" }}
      />
    </div>
  );
}



/**
  state = {
    events: [
      {
        start: moment().set({ hour: 9, minute: 0 }).toDate(),
        end: moment().set({ hour: 17, minute: 30 }).toDate(),
        title: "Store Hours",
      },
      monday,
    ],
  };
 */
