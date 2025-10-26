import { BarChart3, Calendar, Users, UserPlus, Database, Activity, FileText, TestTube, Camera, Pill, MapPin, Stethoscope, UserCog, ScrollText, Calculator, Syringe, Shield, Building2, ClipboardList, ShieldCheck, Receipt, HeartHandshake, ExternalLink, UserCheck, Bed, DoorOpen, LayoutDashboard, Bot, UserSearch, ScissorsLineDashed, Sparkles, MessageSquare } from 'lucide-react';

// AI Surgeon Pilot - AI Features (Prominently displayed at top)
export const aiFeatures = [
  {
    title: "Patient Follow-Up",
    route: "/patient-followup",
    icon: UserSearch,
    description: "Track patient journeys",
    count: 0,
  },
  {
    title: "Patient Education",
    route: "/patient-education",
    icon: FileText,
    description: "Manage educational content",
    count: 0,
  },
  {
    title: "Surgery Options",
    route: "/surgery-options",
    icon: ScissorsLineDashed,
    description: "Configure surgery options",
    count: 0,
  },
  {
    title: "WhatsApp Test",
    route: "/whatsapp-test",
    icon: MessageSquare,
    description: "Test WhatsApp API",
    count: 0,
  },
];

// Core menu items (excluding AI features which are now separate)
export const menuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: BarChart3,
  },
  {
    title: "Patient Dashboard",
    url: "/patient-dashboard",
    icon: Users,
  },
  {
    title: "Patient Overview",
    url: "/patient-overview",
    icon: LayoutDashboard,
  },
  {
    title: "IPD Dashboard",
    url: "/todays-ipd",
    icon: Calendar,
  },
  {
    title: "Today's OPD",
    url: "/todays-opd",
    icon: ClipboardList,
  },
  {
    title: "Currently Admitted",
    url: "/currently-admitted",
    icon: Building2,
  },
  {
    title: "Accommodation",
    url: "/accommodation",
    icon: Bed,
  },
  {
    title: "Room Management",
    url: "/room-management",
    icon: DoorOpen,
  },
  {
    title: "Discharged Patients",
    url: "/discharged-patients",
    icon: UserCheck,
  },

  {
    title: "Security Gate",
    url: "/security-verification",
    icon: Shield,
  },
  {
    title: "Mandatory Service",
    url: "/mandatory-service",
    icon: ShieldCheck,
  },
  {
    title: "Clinical Services",
    url: "/clinical-services",
    icon: HeartHandshake,
  },
  {
    title: "External Requisition",
    url: "/external-requisition",
    icon: ExternalLink,
  },
  {
    title: "CGHS Surgery",
    url: "/cghs-surgery-master",
    icon: Syringe,
  },
  {
    title: "Diagnoses",
    url: "/diagnoses",
    icon: Activity,
  },
  {
    title: "Operation Theatre",
    url: "/operation-theatre",
    icon: Syringe,
  },
  {
    title: "Patients",
    url: "/patients",
    icon: UserPlus,
  },
  {
    title: "Users",
    url: "/users",
    icon: UserCog,
  },
  {
    title: "Complications",
    url: "/complications",
    icon: Database,
  },
  {
    title: "Lab",
    url: "/lab",
    icon: TestTube,
  },
  {
    title: "Radiology",
    url: "/radiology", 
    icon: Camera,
  },
  {
    title: "Medications",
    url: "/medications",
    icon: Pill,
  },
  {
    title: "Prescriptions",
    url: "/prescriptions",
    icon: ScrollText,
  },
  {
    title: "Referees",
    url: "/referees",
    icon: MapPin,
  },
  {
    title: "Hope Surgeons",
    url: "/hope-surgeons",
    icon: Stethoscope,
  },
  {
    title: "Hope Consultants",
    url: "/hope-consultants",
    icon: UserCog,
  },
  {
    title: "Hope Anaesthetists",
    url: "/hope-anaesthetists",
    icon: Syringe,
  },
  {
    title: "Ayushman Surgeons",
    url: "/ayushman-surgeons",
    icon: Stethoscope,
  },
  {
    title: "Ayushman Consultants",
    url: "/ayushman-consultants",
    icon: UserCog,
  },
  {
    title: "Ayushman Anaesthetists",
    url: "/ayushman-anaesthetists",
    icon: Syringe,
  },
  {
    title: "Accounting",
    url: "/accounting",
    icon: Calculator,
  },
  {
    title: "Bill Management",
    url: "/bill-management",
    icon: Receipt,
  },
  {
    title: "Corporate",
    url: "/corporate",
    icon: Building2,
  },
  {
    title: "Pharmacy",
    url: "/pharmacy",
    icon: Pill,
  },
];
