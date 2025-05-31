import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Article {
  id: string;
  title: string;
  summary: string;
  content: string;
  imageUrl: string;
  category: string;
  tags: string[];
  publishDate: Date;
  readTime: number;
  isFavorite: boolean;
  author: string;
}

export interface DailyTip {
  id: string;
  content: string;
  category: string;
}

interface ArticleState {
  articles: Article[];
  favorites: string[];
  dailyTips: DailyTip[];
  toggleArticleFavorite: (id: string) => void;
  getDailyTip: () => DailyTip;
}

// Sample articles data
const sampleArticles: Article[] = [
  {
    id: '1',
    title: 'The 50/30/20 Rule: A Simple Budgeting Method That Actually Works',
    summary: 'Learn how to divide your income into needs, wants, and savings using the popular 50/30/20 budgeting rule.',
    content: `
      <h2>The 50/30/20 Rule: A Simple Budgeting Method That Actually Works</h2>
      
      <p>Creating and sticking to a budget is one of the most important steps toward financial health, but it can also feel overwhelming. The 50/30/20 rule offers a simple framework that anyone can follow.</p>
      
      <h3>What is the 50/30/20 Rule?</h3>
      
      <p>The 50/30/20 rule is a budgeting method that divides your after-tax income into three main categories:</p>
      
      <ul>
        <li><strong>50% for Needs:</strong> These are essential expenses you can't avoid—housing, groceries, utilities, transportation, minimum debt payments, and insurance.</li>
        <li><strong>30% for Wants:</strong> These are non-essential expenses that enhance your lifestyle—dining out, entertainment, hobbies, subscriptions, and shopping.</li>
        <li><strong>20% for Savings:</strong> This portion goes toward building financial security—emergency fund, retirement accounts, investments, and paying off debt beyond minimum payments.</li>
      </ul>
      
      <h3>Why the 50/30/20 Rule Works</h3>
      
      <p>This approach works well for several reasons:</p>
      
      <ul>
        <li><strong>Simplicity:</strong> With just three categories, it's easy to understand and implement.</li>
        <li><strong>Flexibility:</strong> It adapts to different income levels and lifestyles.</li>
        <li><strong>Balance:</strong> It ensures you're covering necessities while still enjoying life and building for the future.</li>
      </ul>
      
      <h3>How to Implement the 50/30/20 Rule</h3>
      
      <ol>
        <li><strong>Calculate your after-tax income:</strong> This is your take-home pay after taxes and deductions.</li>
        <li><strong>Categorize your expenses:</strong> Review your spending from the past few months and group each expense as a need, want, or saving.</li>
        <li><strong>Adjust your spending:</strong> If you're spending more than 50% on needs, look for ways to reduce these costs. If wants exceed 30%, identify areas to cut back.</li>
        <li><strong>Automate your savings:</strong> Set up automatic transfers to ensure 20% of your income goes to savings and debt repayment.</li>
      </ol>
      
      <h3>Adapting the Rule to Your Situation</h3>
      
      <p>While 50/30/20 is a helpful guideline, you might need to adjust the percentages based on your circumstances:</p>
      
      <ul>
        <li>If you live in an expensive city, you might need to allocate more than 50% to needs.</li>
        <li>If you're paying off significant debt, you might want to allocate more than 20% to that category.</li>
        <li>If you're saving for a major goal like a house down payment, you might reduce your wants percentage temporarily.</li>
      </ul>
      
      <h3>Final Thoughts</h3>
      
      <p>The 50/30/20 rule isn't about restricting your spending—it's about creating awareness and intentionality with your money. By giving every dollar a purpose, you can enjoy today while still building financial security for tomorrow.</p>
    `,
    imageUrl: '/business-9090596_1280.jpg',
    category: 'budgeting',
    tags: ['budget', 'personal finance', 'money management', '50/30/20 rule'],
    publishDate: new Date('2025-04-15'),
    readTime: 8,
    isFavorite: false,
    author: 'Emma Rodriguez'
  },
  {
    id: '2',
    title: 'Emergency Funds: How Much You Really Need and Where to Keep It',
    summary: 'Discover why emergency funds are crucial, how much you should save, and the best places to store your safety net.',
    content: `
      <h2>Emergency Funds: How Much You Really Need and Where to Keep It</h2>
      
      <p>Life is unpredictable. Job losses, medical emergencies, car repairs, and other unexpected expenses can derail your finances if you're not prepared. That's where an emergency fund comes in—it's your financial safety net when life throws curveballs.</p>
      
      <h3>Why You Need an Emergency Fund</h3>
      
      <p>An emergency fund serves several crucial purposes:</p>
      
      <ul>
        <li>It prevents you from going into debt when unexpected expenses arise</li>
        <li>It provides peace of mind and reduces financial stress</li>
        <li>It gives you time to make thoughtful decisions rather than panicked ones</li>
        <li>It allows you to take advantage of opportunities that require quick action</li>
      </ul>
      
      <h3>How Much Should You Save?</h3>
      
      <p>The traditional advice is to save 3-6 months of essential expenses. However, the right amount depends on your personal circumstances:</p>
      
      <ul>
        <li><strong>3 months:</strong> If you have a stable job, few debts, no dependents, and multiple income sources</li>
        <li><strong>6 months:</strong> If you have an average job stability, some debt, and dependents</li>
        <li><strong>9-12 months:</strong> If you're self-employed, work in a volatile industry, have a single income household, or have specialized skills that might take longer to find employment</li>
      </ul>
      
      <p>Remember, these are your essential expenses—housing, food, utilities, insurance, minimum debt payments—not your full spending including discretionary items.</p>
      
      <h3>Where to Keep Your Emergency Fund</h3>
      
      <p>Your emergency fund needs to be:</p>
      
      <ol>
        <li><strong>Liquid:</strong> You need to access it quickly without penalties or delays</li>
        <li><strong>Safe:</strong> It shouldn't be subject to market fluctuations or loss</li>
        <li><strong>Separate:</strong> Ideally kept apart from your regular checking account to avoid temptation</li>
      </ol>
      
      <p>The best options include:</p>
      
      <ul>
        <li><strong>High-yield savings accounts:</strong> Offer better interest rates than regular savings while maintaining liquidity</li>
        <li><strong>Money market accounts:</strong> Often offer slightly higher rates and limited check-writing abilities</li>
        <li><strong>Cash management accounts:</strong> Offered by many brokerages, combining features of checking and savings</li>
        <li><strong>Short-term CDs:</strong> Consider a CD ladder for portions of larger emergency funds</li>
      </ul>
      
      <h3>Building Your Emergency Fund</h3>
      
      <p>If starting from zero, follow these steps:</p>
      
      <ol>
        <li>Start with a mini emergency fund of $1,000 while paying off high-interest debt</li>
        <li>Set up automatic transfers to your emergency fund account</li>
        <li>Use windfalls like tax refunds or bonuses to accelerate your savings</li>
        <li>Consider a temporary side hustle dedicated to building your fund</li>
        <li>Celebrate milestones to stay motivated (1 month saved, 3 months, etc.)</li>
      </ol>
      
      <h3>When to Use Your Emergency Fund</h3>
      
      <p>Be clear about what constitutes an emergency. It should be:</p>
      
      <ul>
        <li>Necessary</li>
        <li>Unexpected</li>
        <li>Urgent</li>
      </ul>
      
      <p>A great vacation deal or the latest smartphone release doesn't qualify, but a broken water heater or sudden job loss does.</p>
      
      <h3>Replenishing Your Fund</h3>
      
      <p>After using your emergency fund, make replenishing it a top financial priority. Adjust your budget temporarily to direct more money toward rebuilding your safety net.</p>
      
      <p>Remember, an emergency fund isn't an investment—it's insurance. Its job isn't to grow wealth but to protect the wealth you're building elsewhere in your financial plan.</p>
    `,
    imageUrl: '/cashbox-1642989_1280.jpg',
    category: 'saving',
    tags: ['emergency fund', 'savings', 'financial security'],
    publishDate: new Date('2025-04-10'),
    readTime: 10,
    isFavorite: false,
    author: 'Michael Chen'
  },
  {
    id: '3',
    title: 'Debt Snowball vs. Debt Avalanche: Which Method Is Right for You?',
    summary: 'Compare two popular debt repayment strategies and learn which one might work better for your financial situation.',
    content: `
      <h2>Debt Snowball vs. Debt Avalanche: Which Method Is Right for You?</h2>
      
      <p>Getting out of debt requires a strategy. Two of the most popular approaches are the debt snowball and debt avalanche methods. Both can be effective, but they work in different ways and might suit different personalities and financial situations.</p>
      
      <h3>The Debt Snowball Method</h3>
      
      <p><strong>How it works:</strong> With the debt snowball method, you pay minimum payments on all your debts, then put any extra money toward your smallest debt balance first, regardless of interest rate. Once that smallest debt is paid off, you roll that payment into tackling the next smallest debt, creating a "snowball" effect as you eliminate each debt.</p>
      
      <p><strong>Pros:</strong></p>
      <ul>
        <li>Provides quick wins that boost motivation</li>
        <li>Simplifies your finances as you eliminate individual debts</li>
        <li>Creates psychological momentum that helps you stick with the plan</li>
        <li>Works well for those who need motivation to stay on track</li>
      </ul>
      
      <p><strong>Cons:</strong></p>
      <ul>
        <li>Mathematically, you might pay more in interest over time</li>
        <li>High-interest debts continue accruing interest while you focus on smaller balances</li>
      </ul>
      
      <h3>The Debt Avalanche Method</h3>
      
      <p><strong>How it works:</strong> With the debt avalanche method, you pay minimum payments on all debts, then put any extra money toward the debt with the highest interest rate first, regardless of balance. Once that highest-interest debt is paid off, you move to the debt with the next highest rate.</p>
      
      <p><strong>Pros:</strong></p>
      <ul>
        <li>Mathematically optimal—saves the most money in interest</li>
        <li>Reduces your total debt faster</li>
        <li>Works well for those who are motivated by efficiency and saving money</li>
      </ul>
      
      <p><strong>Cons:</strong></p>
      <ul>
        <li>Might take longer to pay off your first debt if high-interest debts have large balances</li>
        <li>Can feel less motivating without the quick wins of the snowball method</li>
      </ul>
      
      <h3>Which Method Should You Choose?</h3>
      
      <p>Consider these factors when deciding:</p>
      
      <h4>Choose the Snowball if:</h4>
      <ul>
        <li>You've struggled to stay motivated with debt repayment in the past</li>
        <li>You have several small debts that could be eliminated quickly</li>
        <li>You value psychological wins over mathematical optimization</li>
        <li>You need the simplification of having fewer monthly payments</li>
      </ul>
      
      <h4>Choose the Avalanche if:</h4>
      <ul>
        <li>You're motivated by saving money and being efficient</li>
        <li>You have high-interest debts like credit cards or payday loans</li>
        <li>You have the discipline to stick with a plan even without quick wins</li>
        <li>The interest rate differences between your debts are significant</li>
      </ul>
      
      <h3>A Hybrid Approach</h3>
      
      <p>Some people benefit from a hybrid approach:</p>
      <ul>
        <li>Start with the snowball method to build momentum by paying off one or two small debts</li>
        <li>Then switch to the avalanche method to optimize interest savings on remaining debts</li>
        <li>Or target any extremely high-interest debts first (like payday loans), then switch to the snowball for the rest</li>
      </ul>
      
      <h3>Tips for Success with Either Method</h3>
      
      <ol>
        <li><strong>Stop adding new debt</strong> while you're paying off existing balances</li>
        <li><strong>Create a budget</strong> that allows you to put extra money toward debt repayment</li>
        <li><strong>Track your progress</strong> visually to stay motivated</li>
        <li><strong>Celebrate milestones</strong> (in ways that don't involve spending money)</li>
        <li><strong>Consider balance transfers or consolidation</strong> if you can qualify for lower interest rates</li>
      </ol>
      
      <h3>The Bottom Line</h3>
      
      <p>The best debt repayment method is the one you'll actually stick with until you're debt-free. Be honest with yourself about what motivates you, and choose accordingly. Remember that consistency matters more than which method you choose—both will get you debt-free if you stay committed.</p>
    `,
    imageUrl: '/clock-2696234_1280.jpg',
    category: 'debt',
    tags: ['debt repayment', 'debt snowball', 'debt avalanche', 'personal finance'],
    publishDate: new Date('2025-04-05'),
    readTime: 12,
    isFavorite: false,
    author: 'Sarah Johnson'
  },
  {
    id: '4',
    title: 'Index Funds: The Simple Investment Strategy That Beats Most Professionals',
    summary: 'Learn why index fund investing has become the strategy of choice for both beginners and financial experts.',
    content: `
      <h2>Index Funds: The Simple Investment Strategy That Beats Most Professionals</h2>
      
      <p>When it comes to investing, complexity doesn't always equal better results. In fact, one of the simplest investment strategies—buying index funds—has consistently outperformed most actively managed funds over the long term. Here's why index funds have become the cornerstone of many successful investment portfolios.</p>
      
      <h3>What Are Index Funds?</h3>
      
      <p>An index fund is a type of mutual fund or exchange-traded fund (ETF) designed to track a specific market index, such as the S&P 500, Dow Jones Industrial Average, or total stock market. Instead of trying to beat the market by picking individual stocks, index funds aim to match the performance of their target index by holding the same securities in the same proportions.</p>
      
      <h3>Why Index Funds Outperform Most Active Funds</h3>
      
      <p>Despite the expertise and resources of professional fund managers, the majority of actively managed funds underperform their benchmark indexes over extended periods. Here's why:</p>
      
      <ul>
        <li><strong>Lower fees:</strong> Index funds typically charge much lower expense ratios (often 0.03% to 0.2%) compared to actively managed funds (often 0.5% to 1.5% or higher). These fee differences compound dramatically over time.</li>
        <li><strong>Tax efficiency:</strong> Index funds generally have lower turnover rates, resulting in fewer taxable events and better after-tax returns for investors.</li>
        <li><strong>Consistency:</strong> Index funds don't suffer from manager risk or style drift that can affect actively managed funds.</li>
        <li><strong>Market efficiency:</strong> In efficient markets, it's extremely difficult to consistently identify mispriced securities and beat the market after accounting for research costs and fees.</li>
      </ul>
      
      <h3>Getting Started with Index Fund Investing</h3>
      
      <p>Building a portfolio with index funds is straightforward:</p>
      
      <ol>
        <li><strong>Determine your asset allocation</strong> based on your goals, time horizon, and risk tolerance (e.g., 70% stocks, 30% bonds)</li>
        <li><strong>Choose broad-based index funds</strong> for each asset class:
          <ul>
            <li>For U.S. stocks: S&P 500 index fund or total U.S. stock market fund</li>
            <li>For international stocks: Total international stock market fund</li>
            <li>For bonds: Total bond market fund</li>
          </ul>
        </li>
        <li><strong>Consider investment account types</strong> (401(k), IRA, taxable accounts) based on your goals</li>
        <li><strong>Set up automatic investments</strong> to build your portfolio consistently</li>
        <li><strong>Rebalance periodically</strong> (annually or when allocations drift significantly)</li>
      </ol>
      
      <h3>Common Index Fund Portfolio Models</h3>
      
      <h4>Three-Fund Portfolio</h4>
      <p>A popular, simple approach consisting of:</p>
      <ul>
        <li>U.S. total stock market index fund</li>
        <li>International total stock market index fund</li>
        <li>U.S. total bond market index fund</li>
      </ul>
      
      <h4>Target-Date Funds</h4>
      <p>These funds automatically adjust their asset allocation as you approach retirement, becoming more conservative over time. Many target-date funds use index funds as their underlying investments.</p>
      
      <h3>Common Misconceptions About Index Investing</h3>
      
      <ul>
        <li><strong>Myth: Index investing is only for beginners.</strong> Reality: Many sophisticated investors, including Warren Buffett, recommend index funds for most people.</li>
        <li><strong>Myth: Index funds underperform in bear markets.</strong> Reality: While index funds will decline in bear markets, most active managers still fail to outperform during downturns.</li>
        <li><strong>Myth: Index funds lead to mediocre returns.</strong> Reality: Index funds deliver market returns, which historically have been quite strong over long periods.</li>
      </ul>
      
      <h3>The Bottom Line</h3>
      
      <p>Index fund investing isn't about settling for average—it's about capturing market returns efficiently while avoiding the pitfalls that cause most investors to underperform. By keeping costs low, maintaining broad diversification, and staying disciplined through market cycles, index fund investors position themselves for long-term success.</p>
      
      <p>As Warren Buffett famously advised in his will: "Put 10% of the cash in short-term government bonds and 90% in a very low-cost S&P 500 index fund... I believe the trust's long-term results from this policy will be superior to those attained by most investors."</p>
    `,
    imageUrl: '/dirham-3479568_1280.jpg',
    category: 'investing',
    tags: ['index funds', 'investing', 'passive investing', 'ETFs'],
    publishDate: new Date('2025-03-28'),
    readTime: 9,
    isFavorite: false,
    author: 'David Thompson'
  },
  {
    id: '5',
    title: 'How to Talk About Money with Your Partner Without Fighting',
    summary: 'Discover practical strategies for having productive financial conversations that strengthen rather than strain your relationship.',
    content: `
      <h2>How to Talk About Money with Your Partner Without Fighting</h2>
      
      <p>Money is consistently ranked as one of the top sources of conflict in relationships. Different upbringings, values, and habits around money can create tension even in otherwise healthy partnerships. However, developing good financial communication can not only prevent money fights but also strengthen your relationship and help you achieve shared goals.</p>
      
      <h3>Why Money Conversations Are Difficult</h3>
      
      <p>Before diving into strategies, it helps to understand why money talks can be so challenging:</p>
      
      <ul>
        <li>Money is tied to deep emotions and core values</li>
        <li>Financial habits are often formed in childhood and can be subconscious</li>
        <li>Money represents different things to different people (security, freedom, status, control)</li>
        <li>Financial vulnerability can feel risky and uncomfortable</li>
        <li>Society often treats money as a taboo topic, so many people lack practice discussing it</li>
      </ul>
      
      <h3>Setting the Stage for Productive Money Talks</h3>
      
      <ol>
        <li><strong>Schedule dedicated money dates.</strong> Don't ambush your partner with financial discussions. Set aside specific times to talk about money when you're both relaxed and not distracted.</li>
        <li><strong>Create a comfortable environment.</strong> Choose a private, neutral space. Some couples find that discussing money outside the home (like during a walk or at a quiet café) reduces tension.</li>
        <li><strong>Start with appreciation.</strong> Begin by acknowledging something your partner does well financially or a shared financial win.</li>
        <li><strong>Use "I" statements.</strong> Say "I feel anxious when we don't have savings" rather than "You spend too much money."</li>
        <li><strong>Focus on shared goals, not just problems.</strong> Discussing dreams and aspirations makes money talks more positive and forward-looking.</li>
      </ol>
      
      <h3>Essential Financial Conversations to Have</h3>
      
      <h4>1. Money History and Values</h4>
      <p>Share stories about how money was handled in your family growing up and what you learned. Discuss what money means to each of you (security, freedom, success, etc.).</p>
      
      <h4>2. Financial Inventory</h4>
      <p>Create a complete picture of your combined finances: income, expenses, assets, debts, credit scores. This transparency builds trust and allows for informed planning.</p>
      
      <h4>3. Money Management System</h4>
      <p>Decide how you'll handle day-to-day finances: joint accounts, separate accounts, or a combination. Determine who will be responsible for which financial tasks.</p>
      
      <h4>4. Spending Boundaries</h4>
      <p>Agree on a threshold amount that requires discussion before spending (e.g., purchases over $200). This respects autonomy while maintaining communication about significant expenses.</p>
      
      <h4>5. Goals and Priorities</h4>
      <p>Identify short-term and long-term financial goals. Be specific about timelines and dollar amounts, and rank goals by priority.</p>
      
      <h3>Navigating Financial Differences</h3>
      
      <p>It's normal for partners to have different money styles. Common pairings include:</p>
      
      <ul>
        <li>Saver + Spender</li>
        <li>Planner + Spontaneous</li>
        <li>Risk-taker + Security-seeker</li>
        <li>Detail-oriented + Big-picture</li>
      </ul>
      
      <p>These differences can create balance when understood and respected. Try these approaches:</p>
      
      <ul>
        <li><strong>Focus on strengths.</strong> The detail person might handle bill payments, while the big-picture person manages investment strategy.</li>
        <li><strong>Create space for both styles.</strong> A saver and spender might each get a personal "no questions asked" fund.</li>
        <li><strong>Find compromise through clear boundaries.</strong> A risk-taker might invest a small, agreed-upon percentage of assets more aggressively.</li>
      </ul>
      
      <h3>When to Seek Help</h3>
      
      <p>Consider working with a financial therapist or financial planner if:</p>
      
      <ul>
        <li>Money conversations consistently end in conflict</li>
        <li>One partner is secretive about finances</li>
        <li>You have fundamentally different values about money that seem irreconcilable</li>
        <li>Past financial trauma is affecting your current relationship</li>
      </ul>
      
      <h3>The Bottom Line</h3>
      
      <p>Healthy financial communication doesn't mean never disagreeing about money. It means having the tools to work through differences respectfully and constructively. With practice, money talks can become an opportunity to deepen understanding and build a stronger partnership.</p>
      
      <p>Remember that financial intimacy, like other forms of intimacy, develops gradually. Be patient with the process and celebrate progress along the way.</p>
    `,
    imageUrl: '/hai.jpg',
    category: 'budgeting',
    tags: ['relationships', 'communication', 'money talks', 'financial planning'],
    publishDate: new Date('2025-03-20'),
    readTime: 11,
    isFavorite: false,
    author: 'Jennifer Williams'
  }
];

// Sample daily tips
const sampleDailyTips: DailyTip[] = [
  {
    id: '1',
    content: 'Try the 24-hour rule: Wait 24 hours before making any non-essential purchase over Rp. 100.000,00 to avoid impulse buying.',
    category: 'saving'
  },
  {
    id: '2',
    content: 'Set up automatic transfers to your savings account on payday so you save before you have a chance to spend.',
    category: 'saving'
  },
  {
    id: '3',
    content: 'Review your subscriptions quarterly and cancel any you haven\'t used in the past month.',
    category: 'budgeting'
  },
  {
    id: '4',
    content: 'Keep your emergency fund in a high-yield savings account separate from your regular checking to reduce the temptation to spend it.',
    category: 'saving'
  },
  {
    id: '5',
    content: 'When investing, time in the market beats timing the market. Start early, even with small amounts.',
    category: 'investing'
  },
  {
    id: '6',
    content: 'Pay more than the minimum on credit cards. Even Rp. 50.000,00 extra per month can save you hundreds in interest.',
    category: 'debt'
  },
  {
    id: '7',
    content: 'Use the 50/30/20 rule: 50% of income for needs, 30% for wants, and 20% for savings and debt repayment.',
    category: 'budgeting'
  }
];

export const useFinance = create<ArticleState>()(
  persist(
    (set, get) => ({
      articles: sampleArticles,
      favorites: [],
      dailyTips: sampleDailyTips,
      
      toggleArticleFavorite: (id: string) => {
        set((state) => ({
          articles: state.articles.map((article) => 
            article.id === id 
              ? { ...article, isFavorite: !article.isFavorite } 
              : article
          )
        }));
      },
      
      getDailyTip: () => {
        const { dailyTips } = get();
        // Get a "random" tip based on the day of the year to ensure it changes daily but is consistent throughout the day
        const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
        const tipIndex = dayOfYear % dailyTips.length;
        return dailyTips[tipIndex];
      }
    }),
    {
      name: 'finance-store',
    }
  )
);
