export const dailyChallenges = [
  {
    date: null,
    type: "quiz" as const,
    title: "Inflation Check",
    content: {
      type: "mcq-single",
      prompt:
        "If inflation is 6% per year and your savings account gives you 4% interest, what is happening to the real value of your money?",
      options: [
        { text: "It is growing faster than inflation", isCorrect: false },
        { text: "It is staying the same", isCorrect: false },
        { text: "It is losing purchasing power over time", isCorrect: true },
        { text: "Inflation does not affect savings accounts", isCorrect: false },
      ],
      explanation:
        "When inflation (6%) exceeds your interest rate (4%), the real value of your money decreases by roughly 2% per year. Your bank balance grows, but it buys less.",
    },
    xpReward: 25,
    requiredChaptersCompleted: 2,
  },
  {
    date: null,
    type: "scenario" as const,
    title: "The UPI Trap",
    content: {
      type: "scenario",
      prompt:
        "You receive a message on WhatsApp from someone claiming to be your bank. They say your account will be frozen unless you click a link and verify your UPI PIN immediately. What should you do?",
      options: [
        {
          text: "Click the link and verify your PIN, you don't want your account frozen",
          isCorrect: false,
        },
        {
          text: "Ignore the message, banks never ask for your UPI PIN via WhatsApp",
          isCorrect: true,
        },
        {
          text: "Forward the message to your friends so they can protect themselves too",
          isCorrect: false,
        },
        {
          text: "Reply asking them to call you instead",
          isCorrect: false,
        },
      ],
      explanation:
        "Banks will never ask you to share your UPI PIN, OTP, or password via WhatsApp, SMS, or email. This is a classic phishing scam. Always contact your bank directly through their official app or customer care number.",
    },
    xpReward: 25,
    requiredChaptersCompleted: 2,
  },
  {
    date: null,
    type: "quiz" as const,
    title: "Compound Interest Power",
    content: {
      type: "mcq-single",
      prompt:
        "You invest Rs 1,00,000 at 10% annual compound interest. Approximately how much will you have after 7 years (using the Rule of 72)?",
      options: [
        { text: "Rs 1,70,000", isCorrect: false },
        { text: "Rs 2,00,000", isCorrect: true },
        { text: "Rs 3,00,000", isCorrect: false },
        { text: "Rs 1,50,000", isCorrect: false },
      ],
      explanation:
        "The Rule of 72 says your money doubles in approximately 72 / interest rate years. At 10%, it doubles in about 7.2 years. So Rs 1,00,000 becomes approximately Rs 2,00,000.",
    },
    xpReward: 25,
    requiredChaptersCompleted: 2,
  },
  {
    date: null,
    type: "scenario" as const,
    title: "EMI Dilemma",
    content: {
      type: "scenario",
      prompt:
        "You want to buy a phone worth Rs 60,000. The store offers a no-cost EMI plan over 12 months, but the fine print shows a 'processing fee' of Rs 3,000. Your friend says you should just save up for 3 months instead. What's the smartest move?",
      options: [
        {
          text: "Take the EMI, it says no-cost, so the processing fee doesn't matter",
          isCorrect: false,
        },
        {
          text: "Save up for 3 months, you avoid the hidden charges and don't start a debt habit",
          isCorrect: true,
        },
        {
          text: "Put it on a credit card and pay the minimum balance each month",
          isCorrect: false,
        },
        {
          text: "Take a personal loan at lower interest to buy it now",
          isCorrect: false,
        },
      ],
      explanation:
        "The 'no-cost EMI' actually costs Rs 3,000 in processing fees, that's 5% of the phone price. Saving for 3 months costs nothing and builds discipline. Many 'no-cost' EMI offers have hidden charges baked in.",
    },
    xpReward: 25,
    requiredChaptersCompleted: 2,
  },
  {
    date: null,
    type: "quiz" as const,
    title: "Stock Market Basics",
    content: {
      type: "mcq-single",
      prompt:
        "What does it mean when someone says 'Nifty is up 200 points today'?",
      options: [
        {
          text: "200 companies got listed on the stock exchange today",
          isCorrect: false,
        },
        {
          text: "The weighted average of the top 50 stocks on NSE has risen, indicating overall market growth",
          isCorrect: true,
        },
        {
          text: "Each share on the market increased by Rs 200",
          isCorrect: false,
        },
        {
          text: "The government added Rs 200 crores to the market",
          isCorrect: false,
        },
      ],
      explanation:
        "Nifty 50 is an index that tracks the weighted average performance of the 50 largest companies on the National Stock Exchange (NSE). When it goes up, it means the overall market value of these 50 companies has increased.",
    },
    xpReward: 25,
    requiredChaptersCompleted: 2,
  },
  {
    date: null,
    type: "quiz" as const,
    title: "Budget Breakdown",
    content: {
      type: "mcq-single",
      prompt:
        "In the 50/30/20 budgeting rule, what does the '20' represent?",
      options: [
        { text: "20% for entertainment and dining out", isCorrect: false },
        { text: "20% for rent and utilities", isCorrect: false },
        {
          text: "20% for savings, investments, and debt repayment",
          isCorrect: true,
        },
        { text: "20% for emergency spending", isCorrect: false },
      ],
      explanation:
        "The 50/30/20 rule allocates 50% to needs (rent, groceries, bills), 30% to wants (entertainment, shopping), and 20% to savings, investments, and paying off debt. This simple framework is a great starting point for budgeting.",
    },
    xpReward: 25,
    requiredChaptersCompleted: 2,
  },
  {
    date: null,
    type: "scenario" as const,
    title: "The Investment Pitch",
    content: {
      type: "scenario",
      prompt:
        "A colleague tells you about an amazing investment opportunity that guarantees 30% monthly returns. They say hundreds of people have already joined. What should you do?",
      options: [
        {
          text: "Invest quickly before the opportunity closes, 30% monthly is incredible",
          isCorrect: false,
        },
        {
          text: "Ask your colleague for proof of their returns before investing",
          isCorrect: false,
        },
        {
          text: "Recognize this as a likely Ponzi scheme, no legitimate investment guarantees 30% monthly returns",
          isCorrect: true,
        },
        {
          text: "Invest a small amount just to test it out",
          isCorrect: false,
        },
      ],
      explanation:
        "Any investment promising guaranteed 30% monthly returns (that's over 2,000% annually!) is almost certainly a Ponzi scheme. Even the best equity funds average 12-15% per year. If it sounds too good to be true, it is. Ponzi schemes pay early investors with money from new investors until the whole thing collapses.",
    },
    xpReward: 25,
    requiredChaptersCompleted: 2,
  },
  {
    date: null,
    type: "quiz" as const,
    title: "Credit Score Smarts",
    content: {
      type: "mcq-single",
      prompt:
        "Which of the following actions would HURT your credit score the most?",
      options: [
        {
          text: "Checking your own credit score frequently",
          isCorrect: false,
        },
        {
          text: "Missing a credit card payment by 90+ days",
          isCorrect: true,
        },
        {
          text: "Having a credit card but not using it often",
          isCorrect: false,
        },
        {
          text: "Paying your full credit card bill on time every month",
          isCorrect: false,
        },
      ],
      explanation:
        "Missing payments by 90+ days is one of the most damaging actions for your credit score. It stays on your credit report for years. Checking your own score (soft inquiry) does NOT affect it at all. Having a card with low utilization actually helps your score.",
    },
    xpReward: 25,
    requiredChaptersCompleted: 2,
  },
];
