import { create } from "zustand";
import { getUserProgress, submitQuizResults } from "../actions/quiz.actions";
import { getCurrentUserInfo } from "@/auth";


export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  category: string;
  difficulty: "easy" | "medium" | "hard";
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: Date;
  category: string;
  requirement: string;
}

export interface UserProgress {
  level: number;
  points: number;
  quizzesTaken: number;
  correctAnswers: number;
  streakDays: number;
  lastQuizDate?: Date;
  badges: Badge[];
  quizHistory: {
    quizId: string;
    category?: string;
    difficulty?: string;
    score: number;
    total: number;
    date: Date;
  }[];
}


export interface QuizSubmitResult {
  userProgress: UserProgress;
  unlockedBadges: Badge[];
}

interface QuizStore {
  questions: QuizQuestion[];
  userProgress: UserProgress;
  isLoading: boolean;
  error: string | null;
  getRandomQuizQuestions: (count: number, category?: string, difficulty?: string) => QuizQuestion[];
  submitQuizAnswer: (questionId: string, answerIndex: number) => boolean;
  submitQuizResults: (quizData: { category?: string; difficulty?: string; score: number; total: number }) => Promise<QuizSubmitResult>;
  fetchUserProgress: () => Promise<UserProgress>;
}

// Sample quiz questions
const quizQuestions: QuizQuestion[] = [
  // Budgeting questions - Easy
  {
    id: "budget-1",
    question: "What is the 50/30/20 budgeting rule?",
    options: [
      "50% needs, 30% wants, 20% savings",
      "50% savings, 30% needs, 20% wants",
      "50% wants, 30% savings, 20% needs",
      "50% needs, 30% savings, 20% wants"
    ],
    correctAnswer: 0,
    explanation: "The 50/30/20 rule suggests allocating 50% of your income to needs, 30% to wants, and 20% to savings and debt repayment.",
    category: "budgeting",
    difficulty: "easy"
  },
  {
    id: "budget-2",
    question: "Which of the following is NOT typically considered a 'need' in a budget?",
    options: [
      "Rent or mortgage payment",
      "Grocery expenses",
      "Streaming service subscriptions",
      "Health insurance"
    ],
    correctAnswer: 2,
    explanation: "Streaming services are considered 'wants' rather than 'needs' as they are entertainment expenses that aren't essential for survival.",
    category: "budgeting",
    difficulty: "easy"
  },
  {
    id: "budget-3",
    question: "What is a zero-based budget?",
    options: [
      "A budget where you spend zero money",
      "A budget where your income minus expenses equals zero",
      "A budget that starts from zero every month",
      "A budget that only tracks essential expenses"
    ],
    correctAnswer: 1,
    explanation: "A zero-based budget means that your income minus your expenses equals zero because you've assigned every dollar a purpose.",
    category: "budgeting",
    difficulty: "easy"
  },
  
  // Budgeting questions - Medium
  {
    id: "budget-4",
    question: "What is an emergency fund and how much should it typically contain?",
    options: [
      "Money for vacations; 1 month of expenses",
      "Money for unexpected expenses; 3-6 months of expenses",
      "Money for retirement; 1 year of expenses",
      "Money for luxury purchases; 2 months of expenses"
    ],
    correctAnswer: 1,
    explanation: "An emergency fund is money set aside for unexpected expenses like medical emergencies or job loss. Financial experts typically recommend saving 3-6 months of living expenses.",
    category: "budgeting",
    difficulty: "medium"
  },
  {
    id: "budget-5",
    question: "Which budgeting method involves using cash in different envelopes for different spending categories?",
    options: [
      "Zero-based budgeting",
      "50/30/20 method",
      "Envelope system",
      "Pay yourself first method"
    ],
    correctAnswer: 2,
    explanation: "The envelope system involves putting cash into different envelopes labeled for different spending categories. When an envelope is empty, you've reached your spending limit for that category.",
    category: "budgeting",
    difficulty: "medium"
  },
  
  // Budgeting questions - Hard
  {
    id: "budget-6",
    question: "If your monthly take-home pay is $3,000 and you follow the 50/30/20 rule, how much should you allocate to savings if you've already spent $1,600 on needs and $750 on wants?",
    options: [
      "$650",
      "$600",
      "$550",
      "$500"
    ],
    correctAnswer: 0,
    explanation: "Under the 50/30/20 rule, 20% of $3,000 is $600 for savings. You've spent $1,600 on needs (vs. $1,500 allowed) and $750 on wants (vs. $900 allowed). This means you've spent $50 more on needs but $150 less on wants, giving you an extra $100 for savings. So you should allocate $600 + $100 = $650 to savings.",
    category: "budgeting",
    difficulty: "hard"
  },
  
  // Saving questions - Easy
  {
    id: "saving-1",
    question: "What is compound interest?",
    options: [
      "Interest earned only on the principal amount",
      "Interest earned on both the principal and accumulated interest",
      "A fixed interest rate that never changes",
      "Interest that is compounded once at the end of the term"
    ],
    correctAnswer: 1,
    explanation: "Compound interest is interest earned on both the initial principal and the accumulated interest over time. This is why it's often called 'interest on interest.'",
    category: "saving",
    difficulty: "easy"
  },
  {
    id: "saving-2",
    question: "Which of these accounts typically offers the highest interest rate?",
    options: [
      "Checking account",
      "Standard savings account",
      "High-yield savings account",
      "Money market account"
    ],
    correctAnswer: 2,
    explanation: "High-yield savings accounts typically offer higher interest rates than standard savings accounts, checking accounts, or money market accounts.",
    category: "saving",
    difficulty: "easy"
  },
  
  // Saving questions - Medium
  {
    id: "saving-3",
    question: "What is the Rule of 72 used for in personal finance?",
    options: [
      "To calculate how much you need to save for retirement",
      "To estimate how long it takes for money to double at a given interest rate",
      "To determine the ideal asset allocation for your age",
      "To calculate the maximum amount you should spend on housing"
    ],
    correctAnswer: 1,
    explanation: "The Rule of 72 is a simple way to estimate how long it will take for an investment to double. You divide 72 by the annual rate of return to get the approximate number of years.",
    category: "saving",
    difficulty: "medium"
  },
  {
    id: "saving-4",
    question: "If you invest $1,000 at 8% annual compound interest, approximately how much will you have after 9 years (using the Rule of 72)?",
    options: [
      "$1,720",
      "$2,000",
      "$2,160",
      "$1,080"
    ],
    correctAnswer: 2,
    explanation: "Using the Rule of 72, money doubles every 9 years at 8% interest (72 ÷ 8 = 9). So $1,000 would double to $2,000. The additional $160 accounts for the fact that the Rule of 72 is an approximation and actual compound interest would yield slightly more.",
    category: "saving",
    difficulty: "medium"
  },
  
  // Investing questions - Easy
  {
    id: "investing-1",
    question: "What is a stock?",
    options: [
      "A loan you give to a company",
      "Ownership in a company",
      "A government-backed investment",
      "A type of savings account"
    ],
    correctAnswer: 1,
    explanation: "A stock represents ownership (equity) in a company. When you buy a share of stock, you're buying a small piece of that company.",
    category: "investing",
    difficulty: "easy"
  },
  {
    id: "investing-2",
    question: "What is a bond?",
    options: [
      "Ownership in a company",
      "A loan you give to a company or government",
      "A type of cryptocurrency",
      "A guaranteed return investment"
    ],
    correctAnswer: 1,
    explanation: "A bond is essentially a loan that you give to a company or government. They promise to pay you back with interest after a specified period.",
    category: "investing",
    difficulty: "easy"
  },
  
  // Investing questions - Medium
  {
    id: "investing-3",
    question: "What is diversification in investing?",
    options: [
      "Investing all your money in different stocks",
      "Spreading investments across various asset classes to reduce risk",
      "Changing your investment strategy frequently",
      "Investing in foreign markets only"
    ],
    correctAnswer: 1,
    explanation: "Diversification means spreading your investments across different asset classes (stocks, bonds, real estate, etc.) to reduce risk. It's based on the principle that different assets perform differently under the same market conditions.",
    category: "investing",
    difficulty: "medium"
  },
  {
    id: "investing-4",
    question: "What is an ETF (Exchange-Traded Fund)?",
    options: [
      "A type of retirement account",
      "A fund that trades only after the market closes",
      "A collection of stocks or bonds that trades like a single stock",
      "A government bond with tax advantages"
    ],
    correctAnswer: 2,
    explanation: "An ETF (Exchange-Traded Fund) is a basket of securities (like stocks or bonds) that trades on an exchange like a single stock. ETFs offer diversification and typically have lower fees than mutual funds.",
    category: "investing",
    difficulty: "medium"
  },
  
  // Investing questions - Hard
  {
    id: "investing-5",
    question: "If a stock has a P/E ratio of 20 and earnings per share (EPS) of $5, what is the stock price?",
    options: [
      "$25",
      "$100",
      "$4",
      "$15"
    ],
    correctAnswer: 1,
    explanation: "The P/E (Price-to-Earnings) ratio is calculated as Stock Price ÷ EPS. If P/E = 20 and EPS = $5, then Stock Price = P/E × EPS = 20 × $5 = $100.",
    category: "investing",
    difficulty: "hard"
  },
  
  // Debt questions - Easy
  {
    id: "debt-1",
    question: "What is the difference between a secured and unsecured loan?",
    options: [
      "Secured loans have higher interest rates",
      "Secured loans are backed by collateral, unsecured loans are not",
      "Unsecured loans are only available to those with perfect credit",
      "Secured loans are only offered by banks"
    ],
    correctAnswer: 1,
    explanation: "A secured loan is backed by collateral (like a car or house) that the lender can take if you don't repay. An unsecured loan has no collateral and typically carries a higher interest rate due to the increased risk for the lender.",
    category: "debt",
    difficulty: "easy"
  },
  {
    id: "debt-2",
    question: "Which debt repayment strategy involves paying off the smallest debts first?",
    options: [
      "Debt avalanche",
      "Debt consolidation",
      "Debt snowball",
      "Debt settlement"
    ],
    correctAnswer: 2,
    explanation: "The debt snowball method involves paying off debts from smallest to largest, regardless of interest rate. This strategy provides psychological wins as debts are eliminated, helping to maintain motivation.",
    category: "debt",
    difficulty: "easy"
  },
  
  // Debt questions - Medium
  {
    id: "debt-3",
    question: "What is a good debt-to-income ratio?",
    options: [
      "Below 36%",
      "Between 50-60%",
      "Above 50%",
      "Exactly 40%"
    ],
    correctAnswer: 0,
    explanation: "A debt-to-income (DTI) ratio below 36% is generally considered good. Lenders typically prefer borrowers with a DTI under 36%, though some may accept up to 43% for certain loans.",
    category: "debt",
    difficulty: "medium"
  },
  {
    id: "debt-4",
    question: "If you have a $10,000 credit card balance with 18% APR, approximately how much interest would you pay in one year if you make no payments?",
    options: [
      "$1,000",
      "$1,800",
      "$180",
      "$800"
    ],
    correctAnswer: 1,
    explanation: "To calculate the annual interest: $10,000 × 18% = $10,000 × 0.18 = $1,800. This is an approximation as credit card interest is usually compounded daily or monthly, which would result in slightly higher interest.",
    category: "debt",
    difficulty: "medium"
  },
  
  // General finance questions - Easy
  {
    id: "general-1",
    question: "What is inflation?",
    options: [
      "The increase in the stock market value",
      "The general increase in prices and fall in purchasing power of money",
      "The interest rate set by the central bank",
      "The growth rate of the economy"
    ],
    correctAnswer: 1,
    explanation: "Inflation is the rate at which the general level of prices for goods and services rises, causing purchasing power to fall. What cost $1.00 in the past will cost more in the future due to inflation.",
    category: "general",
    difficulty: "easy"
  },
  {
    id: "general-2",
    question: "What is a credit score primarily used for?",
    options: [
      "To determine your net worth",
      "To evaluate your job performance",
      "To assess your creditworthiness for loans and credit",
      "To calculate your tax liability"
    ],
    correctAnswer: 2,
    explanation: "A credit score is a numerical expression of your creditworthiness, based on your credit history. Lenders use it to evaluate the probability that you will repay loans and credit obligations as agreed.",
    category: "general",
    difficulty: "easy"
  },
  
  // General finance questions - Medium
  {
    id: "general-3",
    question: "What is the difference between a traditional IRA and a Roth IRA?",
    options: [
      "There is no difference",
      "Traditional IRAs are for employees, Roth IRAs are for self-employed individuals",
      "Traditional IRAs offer tax-deferred growth, while Roth IRAs offer tax-free growth",
      "Roth IRAs have higher contribution limits than Traditional IRAs"
    ],
    correctAnswer: 2,
    explanation: "With a Traditional IRA, you contribute pre-tax dollars and pay taxes when you withdraw in retirement (tax-deferred growth). With a Roth IRA, you contribute after-tax dollars and withdrawals in retirement are tax-free (tax-free growth).",
    category: "general",
    difficulty: "medium"
  },
  {
    id: "general-4",
    question: "What is the Rule of 72 used for in personal finance?",
    options: [
      "To calculate how much you need to save for retirement",
      "To estimate how long it takes for money to double at a given interest rate",
      "To determine the ideal asset allocation for your age",
      "To calculate the maximum amount you should spend on housing"
    ],
    correctAnswer: 1,
    explanation: "The Rule of 72 is a simple way to estimate how long it will take for an investment to double. You divide 72 by the annual rate of return to get the approximate number of years.",
    category: "general",
    difficulty: "medium"
  }
];


const defaultUserProgress: UserProgress = {
  level: 1,
  points: 0,
  quizzesTaken: 0,
  correctAnswers: 0,
  streakDays: 0,
  badges: [],
  quizHistory: []
};

let initialUserProgress = defaultUserProgress;
if (typeof window !== 'undefined') {
  try {
    const currentUser = getCurrentUserInfo();
    const userSpecificKey = `fintrack_quiz_progress_${currentUser.id}`;
    
    const savedProgress = localStorage.getItem(userSpecificKey);
    if (savedProgress) {
      const parsed = JSON.parse(savedProgress);
      if (parsed && 
          typeof parsed === 'object' && 
          'level' in parsed && 
          'badges' in parsed && 
          'quizHistory' in parsed) {
        console.log(`Initializing quiz store with data from localStorage for user: ${currentUser.id}`);
        initialUserProgress = parsed;
      }
    }
  } catch (error) {
    console.warn("Failed to load initial quiz data from localStorage:", error);
  }
}

export const useQuiz = create<QuizStore>((set, get) => ({
  questions: quizQuestions,
  userProgress: initialUserProgress,
  isLoading: false,
  error: null,
  
  getRandomQuizQuestions: (count, category, difficulty) => {
    const allQuestions = get().questions;
    
    let filteredQuestions = allQuestions;
    if (category) {
      filteredQuestions = filteredQuestions.filter(q => q.category === category);
    }
    if (difficulty) {
      filteredQuestions = filteredQuestions.filter(q => q.difficulty === difficulty);
    }
    
    const shuffled = [...filteredQuestions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, shuffled.length));
  },
  
  submitQuizAnswer: (questionId, answerIndex) => {
    const question = get().questions.find(q => q.id === questionId);
    if (!question) return false;
    return question.correctAnswer === answerIndex;
  },
  
  submitQuizResults: async (quizData) => {
    set({ isLoading: true, error: null });
    
    try {
      const result = await submitQuizResults(quizData);
      
      set({ 
        userProgress: result.userProgress,
        isLoading: false 
      });
      
      if (typeof window !== 'undefined') {
        try {
          const currentUser = getCurrentUserInfo();
          const userSpecificKey = `fintrack_quiz_progress_${currentUser.id}`;
          localStorage.setItem(userSpecificKey, JSON.stringify(result.userProgress));
        } catch (error) {
          console.warn("Failed to save quiz progress to localStorage:", error);
        }
      }
      
      return result;
    } catch (error) {
      console.error("Error submitting quiz results:", error);
      set({ 
        error: error instanceof Error ? error.message : "Failed to submit quiz results",
        isLoading: false 
      });
      
      if (typeof window !== 'undefined') {
        try {
          const currentProgress = get().userProgress;
          
          const updatedProgress = {
            ...currentProgress,
            quizzesTaken: currentProgress.quizzesTaken + 1,
            correctAnswers: currentProgress.correctAnswers + quizData.score,
            points: currentProgress.points + quizData.score,
            level: Math.floor((currentProgress.points + quizData.score) / 100) + 1,
            quizHistory: [
              ...currentProgress.quizHistory,
              {
                quizId: new Date().getTime().toString(),
                category: quizData.category,
                difficulty: quizData.difficulty,
                score: quizData.score,
                total: quizData.total,
                date: new Date()
              }
            ]
          };
          
          const currentUser = getCurrentUserInfo();
          const userSpecificKey = `fintrack_quiz_progress_${currentUser.id}`;
          localStorage.setItem(userSpecificKey, JSON.stringify(updatedProgress));
          
          set({ userProgress: updatedProgress });
          
          return {
            userProgress: updatedProgress,
            unlockedBadges: []
          };
        } catch (storageError) {
          console.warn("Failed to update localStorage after API error:", storageError);
        }
      }
      
      throw error;
    }
  },
  
  fetchUserProgress: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const progress = await getUserProgress();
      
      set({ 
        userProgress: progress,
        isLoading: false 
      });
      
      if (typeof window !== 'undefined') {
        try {
          const currentUser = getCurrentUserInfo();
          const userSpecificKey = `fintrack_quiz_progress_${currentUser.id}`;
          localStorage.setItem(userSpecificKey, JSON.stringify(progress));
        } catch (error) {
          console.warn("Failed to save fetched quiz progress to localStorage:", error);
        }
      }
      
      return progress;
    } catch (error) {
      console.error("Error fetching user progress:", error);
      set({ 
        error: error instanceof Error ? error.message : "Failed to fetch user progress",
        isLoading: false 
      });
      
      if (typeof window !== 'undefined') {
        try {
          const currentUser = getCurrentUserInfo();
          const userSpecificKey = `fintrack_quiz_progress_${currentUser.id}`;
          const savedProgress = localStorage.getItem(userSpecificKey);
          if (savedProgress) {
            const parsedProgress = JSON.parse(savedProgress);
            set({ userProgress: parsedProgress });
            return parsedProgress;
          }
        } catch (storageError) {
          console.warn("Failed to get progress from localStorage after API error:", storageError);
        }
      }
      
      return get().userProgress;
    }
  }
}));
