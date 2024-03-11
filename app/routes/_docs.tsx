
export default function Mainbody() {
  const { user, deFees, dataPDF, statsData, comsRecords } = useLoaderData()
  const userIsAllowed = getUserIsAllowed(user, ["ADMIN"]);
  console.log(user, 'usersettings')
  return (
    <>
      <div className="flex h-[100%] w-[98vw] left-0">
        <div className="w-[300px] rounded-lg h-[95%] bg-slate12 text-slate2  ">
          <hr className="solid" />
          <RemixNavLink to={`/welcome/quote`}>
            <Button
              variant="link"
              className="w-full justify-start cursor-pointer text-white "
            >
              Walkthrough
            </Button>
          </RemixNavLink>
          {userIsAllowed ? (
            <>
              <RemixNavLink to={`/admin`}>
                <Button variant="link" className="w-full justify-start cursor-pointer text-white" >
                  Admin
                </Button>
              </RemixNavLink>
            </>
          ) : (null)}
          <RemixNavLink to={`/user/dashboard/password`}>
            <Button
              variant="link"
              className="w-full justify-start cursor-pointer text-white"
            >
              Change Password
            </Button>
          </RemixNavLink>
          <RemixNavLink to={`/docs`}>
            <Button
              variant="link"
              className="w-full justify-start cursor-pointer text-white"
            >
              Docs
            </Button>
          </RemixNavLink>
          <RemixNavLink to={`/logout`}>
            <Button variant="link" className="w-full justify-start cursor-pointer text-white" >
              Log out
            </Button>
          </RemixNavLink>
        </div>
        <div className='w-[98%]'>
          <Outlet />
        </div>
      </div>
    </>
  )
}

