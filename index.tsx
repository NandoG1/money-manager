import {
  HiSquares2X2,
  HiCreditCard,
  HiArrowUp,
  HiArrowDown,
  HiBanknotes,
  HiArrowsRightLeft,
  HiDocumentArrowDown,
  HiClipboardDocumentCheck,
  HiDocumentText,
  HiClock,
  HiBookOpen,
  HiAcademicCap,
  HiFlag,
  HiSparkles,
  HiChatBubbleLeftRight,
} from "react-icons/hi2";

export const BASE_API_URL = process.env.NEXT_PUBLIC_BASE_API_URL;

export const SidebarLinks = [
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: <HiSquares2X2 size={20} />,
    section: "Navigation",
  },
  {
    title: "Account",
    path: "/account",
    icon: <HiCreditCard size={20} />,
    section: "Navigation",
  },
  {
    title: "Income",
    path: "/income",
    icon: <HiArrowUp size={20} />,
    section: "Navigation",
  },
  {
    title: "Expense",
    path: "/expense",
    icon: <HiArrowDown size={20} />,
    section: "Navigation",
  },
  {
    title: "Transfer",
    path: "/transfer",
    icon: <HiArrowsRightLeft size={20} />,
    section: "Navigation",
  },
  {
    title: "Category",
    path: "/category",
    icon: <HiBanknotes size={20} />,
    section: "Navigation",
  },
  {
    title: "Tasks",
    path: "/tasks",
    icon: <HiClipboardDocumentCheck size={20} />,
    section: "Utility",
  },
  {
    title: "Notes",
    path: "/notes",
    icon: <HiDocumentText size={20} />,
    section: "Utility",
  },
  {
    title: "Articles",
    path: "/articles",
    icon: <HiBookOpen size={20} />,
    section: "Utility",
  },
  {
    title: "Financial Quiz",
    path: "/quiz",
    icon: <HiAcademicCap size={20} />,
    section: "Utility",
  },
  {
    title: "Pomodoro",
    path: "/pomodoro",
    icon: <HiClock size={20} />,
    section: "Utility",
  },
  {
    title: "Backup",
    path: "/backup",
    icon: <HiDocumentArrowDown size={20} />,
    section: "Utility",
  },
  {
    title: "Goals",
    path: "/goals",
    icon: <HiFlag size={20} />,
    section: "Utility",
  },
  {
    title: "AI Advice",
    path: "/ai-advice",
    icon: <HiSparkles size={20} />,
    section: "AI Tools",
  },
  {
    title: "Predict Money",
    path: "/predict",
    icon: <HiChatBubbleLeftRight size={20} />,
    section: "AI Tools",
  },
];

export type AccountType = {
  _id: string;
  name: string;
  user: string;
  balance: number;
  color: string;
  income: TransactionType[];
  expense: TransactionType[];
};

export type TransactionType = {
  _id: string;
  name: string;
  date: string;
  amount: number;
  user: string;
  account: string;
  total?: number;
  type?: string;
};

export type TransactionHighest = {
  _id: string;
  type: string;
  name: string;
  date: string;
  amount: number;
};

export type CategoryType = {
  _id: string;
  name: string;
  budget: number;
};

export type CategoryExpenses = {
  _id: string;
  name: string;
  budget: number;
  totalExpenses: number;
};

export type TransferType = {
  _id: string;
  name: string;
  date: Date;
  amount: number;
  user: string;
  type: string;
  from: string;
  to: string;
  fromId: string;
  toId: string;
  fromColor: string;
  toColor: string;
};

export const currencyFormatter = (amount: number) => {
  const formatter = Intl.NumberFormat("id-ID", {
    currency: "IDR",
    style: "currency",
  });

  return formatter.format(amount);
};
