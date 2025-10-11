import ProfilePage from '@/views/on2door/administrators/profiles'

const ProfilePageRoute = async ({ params }) => {
  const { id } = await params

  return <ProfilePage userId={id} />
}

export default ProfilePageRoute
