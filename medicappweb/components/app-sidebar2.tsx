"use client"

import * as React from "react"
import {
  Frame,
  PieChart,


} from "lucide-react"

import { NavProjects } from "@/components/nav-projects"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
 
  projects: [
    {
      name: "Inicio",
      url: "home",
      icon: Frame,
    },
    {
      name: "Correo y contraseñas",
      url: "cyc",
      icon: PieChart,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>

      </SidebarHeader>
      <SidebarContent>

        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>

      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
