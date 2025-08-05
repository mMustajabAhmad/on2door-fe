// Next Imports
import dynamic from 'next/dynamic'

// Component Imports
// import UserProfile from '@views/pages/user-profile'
import AdministratorProfile from '@/views/on2door/profiles'

// Data Imports
import { getProfileData } from '@/app/server/actions'

// const ProfileTab = dynamic(() => import('@views/pages/user-profile/profile/index'))
// const TeamsTab = dynamic(() => import('@views/pages/user-profile/teams/index'))
// const ProjectsTab = dynamic(() => import('@views/pages/user-profile/projects/index'))
// const ConnectionsTab = dynamic(() => import('@views/pages/user-profile/connections/index'))

const ProfileTab = dynamic(() => import('@/views/on2door/profiles/profile/index'))
const TeamsTab = dynamic(() => import('@/views/on2door/profiles/teams/index'))
const ProjectsTab = dynamic(() => import('@/views/on2door/profiles/projects/index'))
const ConnectionsTab = dynamic(() => import('@/views/on2door/profiles/connections/index'))

// Vars
const tabContentList = data => ({
  profile: <ProfileTab data={data?.users.profile} />,
  teams: <TeamsTab data={data?.users.teams} />,
  projects: <ProjectsTab data={data?.users.projects} />,
  connections: <ConnectionsTab data={data?.users.connections} />
})

/**
 * ! If you need data using an API call, uncomment the below API code, update the `process.env.API_URL` variable in the
 * ! `.env` file found at root of your project and also update the API endpoints like `/pages/profile` in below example.
 * ! Also, remove the above server action import and the action itself from the `src/app/server/actions.ts` file to clean up unused code
 * ! because we've used the server action for getting our static data.
 */
/* const getProfileData = async () => {
  // Vars
  const res = await fetch(`${process.env.API_URL}/pages/profile`)

  if (!res.ok) {
    throw new Error('Failed to fetch profileData')
  }

  return res.json()
} */
const ProfilePage = async ({ params }) => {
  // Vars
  const { id } = await params
  const data = await getProfileData(id)

  return <AdministratorProfile data={data} tabContentList={tabContentList(data)} userId={id} />
}

export default ProfilePage
