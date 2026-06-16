import NavbarClient from './NavbarClient'
import { getNavMenuItems } from '@/lib/utils/nav-server'

/**
 * Server component wrapper: fetches nav items from DB and passes to client Navbar.
 * Falls back to hardcoded data if the table is empty or unavailable.
 */
export default async function Navbar() {
  const navItems = await getNavMenuItems()
  return <NavbarClient navItems={navItems} />
}
