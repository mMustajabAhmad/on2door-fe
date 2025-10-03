// Next Imports
import { useParams } from 'next/navigation'

// MUI Imports
import Chip from '@mui/material/Chip'
import { useTheme } from '@mui/material/styles'

// Third-party Imports
import PerfectScrollbar from 'react-perfect-scrollbar'
// import { useSession } from 'next-auth/react'

// Component Imports
import { Menu, SubMenu, MenuItem, MenuSection } from '@menu/vertical-menu'

// import { GenerateVerticalMenu } from '@components/GenerateMenu'
// Hook Imports
import useVerticalNav from '@menu/hooks/useVerticalNav'

// Styled Component Imports
import StyledVerticalNavExpandIcon from '@menu/styles/vertical/StyledVerticalNavExpandIcon'

// Style Imports
import menuItemStyles from '@core/styles/vertical/menuItemStyles'
import menuSectionStyles from '@core/styles/vertical/menuSectionStyles'

const RenderExpandIcon = ({ open, transitionDuration }) => (
  <StyledVerticalNavExpandIcon open={open} transitionDuration={transitionDuration}>
    <i className='ri-arrow-right-s-line' />
  </StyledVerticalNavExpandIcon>
)

const SideNav = ({ dictionary, scrollMenu }) => {
  // Hooks
  const theme = useTheme()
  const verticalNavOptions = useVerticalNav()
  const params = useParams()
  // const { data: session } = useSession()

  // Vars
  const { isBreakpointReached, transitionDuration } = verticalNavOptions
  const { lang: locale } = params
  const ScrollWrapper = isBreakpointReached ? 'div' : PerfectScrollbar

  const currentUser = JSON.parse(localStorage.getItem('currentUser'))
  const organizationId = currentUser?.organization_id
  const userRole = currentUser?.role

  return (
    // eslint-disable-next-line lines-around-comment
    /* Custom scrollbar instead of browser scroll, remove if you want browser scroll only */
    <ScrollWrapper
      {...(isBreakpointReached
        ? {
            className: 'bs-full overflow-y-auto overflow-x-hidden',
            onScroll: container => scrollMenu(container, false)
          }
        : {
            options: { wheelPropagation: false, suppressScrollX: true },
            onScrollY: container => scrollMenu(container, true)
          })}
    >
      {/* Incase you also want to scroll NavHeader to scroll with Vertical Menu, remove NavHeader from above and paste it below this comment */}
      {/* Vertical Menu */}
      <Menu
        popoutMenuOffset={{ mainAxis: 10 }}
        menuItemStyles={menuItemStyles(verticalNavOptions, theme)}
        renderExpandIcon={({ open }) => <RenderExpandIcon open={open} transitionDuration={transitionDuration} />}
        renderExpandedMenuItemIcon={{ icon: <i className='ri-circle-line' /> }}
        menuSectionStyles={menuSectionStyles(verticalNavOptions, theme)}
      >
        <MenuItem href={`/${locale}/dashboard`} icon={<i className='ri-home-smile-line' />}>
          {dictionary['navigation'].dashboards}
        </MenuItem>

        <MenuSection label={dictionary['navigation'].appsPages}>
          {/* Show all menu items for non-dispatcher roles */}
          {userRole !== 'dispatcher' && (
            <>
              <MenuItem href={`/${locale}/organizations/${organizationId}`} icon={<i className='ri-building-line' />}>
                {dictionary['on2door'].organization}
              </MenuItem>
              <MenuItem href={`/${locale}/administrators/admins`} icon={<i className='ri-admin-line' />}>
                {dictionary['on2door'].admins}
              </MenuItem>
              <MenuItem href={`/${locale}/administrators/dispatchers`} icon={<i className='ri-user-line' />}>
                {dictionary['on2door'].dispatchers}
              </MenuItem>
              <MenuItem href={`/${locale}/hubs`} icon={<i className='ri-home-line' />}>
                {dictionary['on2door'].hubs}
              </MenuItem>
              <MenuItem href={`/${locale}/teams`} icon={<i className='ri-team-line' />}>
                {dictionary['on2door'].teams}
              </MenuItem>
            </>
          )}

          {/* Show drivers and tasks for all roles */}
          <MenuItem href={`/${locale}/drivers`} icon={<i className='ri-steering-line' />}>
            {dictionary['on2door'].drivers}
          </MenuItem>
          <MenuItem href={`/${locale}/tasks`} icon={<i className='ri-task-line' />}>
            {dictionary['on2door'].tasks}
          </MenuItem>
          <MenuItem href={`/${locale}/fleet`} icon={<i className='ri-car-line' />}>
            {dictionary['on2door'].fleet}
          </MenuItem>
        </MenuSection>
      </Menu>
    </ScrollWrapper>
  )
}

export default SideNav
