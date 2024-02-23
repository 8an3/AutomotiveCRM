import React, { Fragment, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import {
  Calendar,
  Views,
  DateLocalizer,
  momentLocalizer,
} from 'react-big-calendar'
import * as dates from '~/components/dashboard/calendar/dates'
import { model } from '~/models';
;
import { prisma } from "~/libs";
import { getAllFinanceAptsForCalendar, getSingleFinanceAppts } from '~/utils/financeAppts/get.server';
import { type ActionFunction, type DataFunctionArgs, json, redirect, } from '@remix-run/node';
import { getSession as sessionGet, getUserByEmail } from '~/utils/user/get'




const mLocalizer = momentLocalizer(moment)

const ColoredDateCellWrapper = ({ children }) =>
  React.cloneElement(React.Children.only(children), {
    style: {
      backgroundColor: 'lightblue',
    },
  })

export async function loader({ request, params }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const email = session.get("email")

  const user = await model.user.query.getForSession({ email: email });
  /// console.log(user, account, 'wquiote loadert')
  if (!user) {
    redirect('/login')
  }
  if (!user) { return json({ status: 302, redirect: '/login' }); };

  console.log(user, 'email')
  const userId = user?.id
  const userEmail = user?.email
  const salesData = await getAllFinanceAptsForCalendar(userId)
  const Delivery = await prisma.clientApts.findMany({
    where: { apptStatus: 'Delivery', },
    orderBy: { createdAt: 'desc', },
  });
  //  console.log(salesData)
  return json({ salesData, user, Delivery })
}
/**
 * We are defaulting the localizer here because we are using this same
 * example on the main 'About' page in Storybook
 */
export default function Basic({
  localizer = mLocalizer,
  showDemoLink = true,
  salesData = [],
  ...props
}) {
  const { components, defaultDate, max, views } = useMemo(
    () => ({
      components: {
        timeSlotWrapper: ColoredDateCellWrapper,
      },
      defaultDate: new Date(2015, 3, 1),
      max: dates.add(dates.endOf(new Date(2015, 17, 1), 'day'), -1, 'hours'),
      views: Object.keys(Views).map((k) => Views[k]),
    }),
    []
  )

  const formattedData = salesData.map(event => ({
    ...event,
    start: new Date(event.start),
    end: new Date(new Date(event.start).setHours(new Date(event.start).getHours() + 1)),
  }));

  // state to store events
  const events = [
    {
      id: 0,
      title: 'Board meeting',
      start: new Date(2018, 0, 29, 9, 0, 0),
      end: new Date(2018, 0, 29, 13, 0, 0),
      resourceId: [1, 2],
    },
    {
      id: 1,
      title: 'MS training',
      start: new Date(2018, 0, 29, 14, 0, 0),
      end: new Date(2018, 0, 29, 16, 30, 0),
      resourceId: 2,
    },
    {
      id: 2,
      title: 'Team lead meeting',
      start: new Date(2018, 0, 29, 8, 30, 0),
      end: new Date(2018, 0, 29, 12, 30, 0),
      resourceId: 3,
    },
    {
      id: 10,
      title: 'Board meeting',
      start: new Date(2018, 0, 30, 23, 0, 0),
      end: new Date(2018, 0, 30, 23, 59, 0),
      resourceId: 1,
    },
    {
      id: 11,
      title: 'Birthday Party',
      start: new Date(2018, 0, 30, 7, 0, 0),
      end: new Date(2018, 0, 30, 10, 30, 0),
      resourceId: 4,
    },
    {
      id: 12,
      title: 'Board meeting',
      start: new Date(2018, 0, 29, 23, 59, 0),
      end: new Date(2018, 0, 30, 13, 0, 0),
      resourceId: 1,
    },
    {
      id: 13,
      title: 'Board meeting',
      start: new Date(2018, 0, 29, 23, 50, 0),
      end: new Date(2018, 0, 30, 13, 0, 0),
      resourceId: 2,
    },
    {
      id: 14,
      title: 'Board meeting',
      start: new Date(2018, 0, 29, 23, 40, 0),
      end: new Date(2018, 0, 30, 13, 0, 0),
      resourceId: 4,
    },
  ]
  const [myEvents, setMyEvents] = useState(events)

  return (
    <Fragment>
      <div className="height600" {...props}>
        <Calendar
          components={components}
          defaultDate={defaultDate}
          events={myEvents}
          localizer={localizer}
          max={max}
          showMultiDayTimes
          step={60}
          views={views}
        />
      </div>
    </Fragment>
  )
}
Basic.propTypes = {
  localizer: PropTypes.instanceOf(DateLocalizer),
  showDemoLink: PropTypes.bool,
}
