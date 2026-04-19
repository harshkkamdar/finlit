// Lessons are created with a placeholder chapterId that will be replaced during seeding.
// Each lesson has realistic educational content for the FinLit platform.

export const lessons = [
  // ─── Chapter 0: What Even is Money? ──────────────────────────────────
  {
    chapterNumber: 0,
    lessonNumber: "0.1",
    title: "Barter to Coins: The Origin Story",
    estimatedMinutes: 10,
    order: 0,
    content: {
      blocks: [
        {
          type: "text",
          data: {
            paragraphs: [
              "Imagine living thousands of years ago. You're a farmer with extra rice, and you need cloth. You'd have to find someone who has cloth AND wants rice, this is the 'double coincidence of wants' problem. It sounds simple, but it was a nightmare. What if the cloth maker wanted fish, not rice? You'd have to find a fisherman who wanted rice, trade with them, then go back to the cloth maker.",
              "This clunky system is called barter, and it worked in small communities. But as trade grew, people needed something better, a universal medium of exchange. Different civilizations tried seashells (cowrie shells were used in India!), salt (the word 'salary' comes from the Latin 'salarium', salt money), and even large stones.",
              "Eventually, metals like gold and silver won out because they were durable, divisible, portable, and rare. The Lydians (modern-day Turkey) created the first standardized coins around 600 BCE. India's own coinage history goes back to the 6th century BCE with punch-marked silver coins called 'Karshapana'. This was revolutionary, suddenly, trade could happen between strangers across vast distances.",
            ],
          },
        },
        {
          type: "callout",
          data: {
            variant: "tip",
            text: "Fun fact: India's cowrie shells were so widely used as currency that they were accepted from Africa to China. The word 'kaudi' (cowrie) is still used to mean something of tiny value.",
          },
        },
        {
          type: "key-term",
          data: {
            term: "Double Coincidence of Wants",
            definition:
              "The situation where two people each have what the other wants and are willing to trade directly. This fundamental problem of barter led to the invention of money.",
          },
        },
        {
          type: "image",
          data: {
            url: "/images/lessons/barter-to-coins.svg",
            alt: "Timeline showing evolution from barter to coins",
            caption:
              "The journey from barter to coins took thousands of years and revolutionized human civilization.",
          },
        },
        {
          type: "text",
          data: {
            paragraphs: [
              "The invention of coins didn't just make trade easier, it transformed entire civilizations. Kingdoms could now pay armies, collect taxes efficiently, and fund massive building projects. The Maurya Empire under Chandragupta used a sophisticated monetary system that Kautilya described in the Arthashastra, one of the world's earliest economics textbooks.",
            ],
          },
        },
      ],
    },
    exercises: [
      {
        type: "mcq-single",
        prompt:
          "Why did the barter system become impractical as civilizations grew?",
        options: [
          { text: "People didn't have anything to trade", isCorrect: false },
          {
            text: "It required a double coincidence of wants, which was hard to find",
            isCorrect: true,
          },
          { text: "The government banned bartering", isCorrect: false },
          { text: "Barter only worked with food items", isCorrect: false },
        ],
        explanation:
          "The core problem with barter is the 'double coincidence of wants', you need to find someone who has exactly what you want AND wants exactly what you have. As communities grew larger and needs became more diverse, this became increasingly impractical.",
        xpValue: 10,
      },
      {
        type: "true-false",
        prompt:
          "The word 'salary' originates from the Latin word for salt, because Roman soldiers were sometimes paid in salt.",
        options: [
          { text: "True", isCorrect: true },
          { text: "False", isCorrect: false },
        ],
        explanation:
          "True! 'Salary' comes from 'salarium', related to salt. While the exact history is debated, salt was indeed a valuable commodity used in trade and possibly as payment for Roman soldiers.",
        xpValue: 10,
      },
      {
        type: "mcq-single",
        prompt:
          "What were 'Karshapana' coins in ancient India?",
        options: [
          { text: "Gold coins used by the Mughal Empire", isCorrect: false },
          {
            text: "Punch-marked silver coins from the 6th century BCE",
            isCorrect: true,
          },
          { text: "Copper coins introduced by the British", isCorrect: false },
          { text: "Paper currency used during the Maurya Empire", isCorrect: false },
        ],
        explanation:
          "Karshapana were among India's earliest coins, punch-marked silver pieces dating back to the 6th century BCE. They were hand-stamped with symbols representing different authorities and regions.",
        xpValue: 10,
      },
      {
        type: "scenario",
        prompt:
          "You're a merchant in ancient India with 100 kg of spices. You need tools, cloth, and pottery. Under the barter system, what's the biggest challenge you'd face?",
        options: [
          {
            text: "Finding separate people who want spices AND have each item you need",
            isCorrect: true,
          },
          { text: "Carrying 100 kg of spices to the market", isCorrect: false },
          { text: "Spices were not valuable in ancient India", isCorrect: false },
          {
            text: "The government controlled all trades",
            isCorrect: false,
          },
        ],
        explanation:
          "You'd need to find a toolmaker who wants spices, a weaver who wants spices, and a potter who wants spices. If any of them don't want spices, you're stuck, or you need to make multiple intermediate trades to get what they do want. This is exactly why money was invented!",
        xpValue: 15,
      },
    ],
  },
  {
    chapterNumber: 0,
    lessonNumber: "0.2",
    title: "Banks & the RBI: Who Controls Your Money?",
    estimatedMinutes: 10,
    order: 1,
    content: {
      blocks: [
        {
          type: "text",
          data: {
            paragraphs: [
              "When you deposit Rs 1,000 in a bank, the bank doesn't just keep it in a locker with your name on it. It lends most of that money to other people, borrowers who need home loans, business loans, or personal credit. The bank charges them interest, pays you a smaller interest, and pockets the difference. That's basically how banks make money.",
              "But who watches the banks? Enter the Reserve Bank of India (RBI), established in 1935. The RBI is India's central bank, think of it as the 'bank of banks'. It decides how much interest banks should charge, how much cash they must keep in reserve, and even designs and prints the currency notes in your wallet. Every Rs 500 note you've ever held says 'I promise to pay the bearer' signed by the RBI Governor.",
              "The RBI has several powerful tools to manage the economy. When inflation rises too fast (prices going up), the RBI increases interest rates to slow down borrowing and spending. When the economy is sluggish, it lowers rates to encourage people and businesses to borrow and invest. This balancing act is called monetary policy, and it affects everything from your home loan EMI to the price of vegetables.",
            ],
          },
        },
        {
          type: "key-term",
          data: {
            term: "Repo Rate",
            definition:
              "The interest rate at which the RBI lends money to commercial banks. When the repo rate goes up, borrowing becomes more expensive for everyone, your loan EMIs increase. When it goes down, borrowing gets cheaper.",
          },
        },
        {
          type: "callout",
          data: {
            variant: "important",
            text: "Your bank deposits up to Rs 5,00,000 are insured by DICGC (a subsidiary of RBI). This means even if your bank collapses, you'll get up to Rs 5 lakh back. This is why you should spread large amounts across multiple banks.",
          },
        },
        {
          type: "image",
          data: {
            url: "/images/lessons/rbi-functions.svg",
            alt: "Diagram showing RBI's key functions",
            caption:
              "The RBI acts as the regulator, banker to banks, currency issuer, and economic stabilizer.",
          },
        },
      ],
    },
    exercises: [
      {
        type: "mcq-single",
        prompt:
          "When you deposit Rs 10,000 in your savings account, what does the bank primarily do with it?",
        options: [
          {
            text: "Keeps it safely locked in a vault with your name on it",
            isCorrect: false,
          },
          {
            text: "Lends most of it to borrowers and earns interest on those loans",
            isCorrect: true,
          },
          {
            text: "Sends it directly to the RBI for safekeeping",
            isCorrect: false,
          },
          {
            text: "Invests all of it in the stock market",
            isCorrect: false,
          },
        ],
        explanation:
          "Banks operate on a fractional reserve system, they keep a fraction of your deposit as reserves and lend out the rest. The difference between the interest they charge borrowers and the interest they pay you is their profit margin.",
        xpValue: 10,
      },
      {
        type: "true-false",
        prompt:
          "The DICGC insures bank deposits up to Rs 5,00,000 per depositor per bank.",
        options: [
          { text: "True", isCorrect: true },
          { text: "False", isCorrect: false },
        ],
        explanation:
          "True! The Deposit Insurance and Credit Guarantee Corporation (DICGC), a subsidiary of the RBI, insures deposits up to Rs 5,00,000 per depositor per bank. This was increased from Rs 1,00,000 in 2020.",
        xpValue: 10,
      },
      {
        type: "mcq-single",
        prompt: "If the RBI raises the repo rate, what typically happens?",
        options: [
          { text: "Loan EMIs decrease and borrowing becomes cheaper", isCorrect: false },
          { text: "Loan EMIs increase and borrowing becomes more expensive", isCorrect: true },
          { text: "The stock market always crashes immediately", isCorrect: false },
          { text: "Banks stop giving loans entirely", isCorrect: false },
        ],
        explanation:
          "When the RBI raises the repo rate, banks have to pay more to borrow from the RBI. They pass this cost to customers through higher loan interest rates, making EMIs go up. This is done to control inflation by reducing spending.",
        xpValue: 10,
      },
    ],
  },

  // ─── Chapter 1: The Stock Market ─────────────────────────────────────
  {
    chapterNumber: 1,
    lessonNumber: "1.1",
    title: "What is a Stock? Owning a Piece of a Company",
    estimatedMinutes: 10,
    order: 0,
    content: {
      blocks: [
        {
          type: "text",
          data: {
            paragraphs: [
              "Imagine your friend opens a tea shop and needs Rs 10,000 to buy better equipment. You give them Rs 5,000 in exchange for 50% of the profits. Congratulations, you essentially just bought 'stock' in their business! When a real company does this at a massive scale, it issues shares (also called stocks or equity) that anyone can buy.",
              "When a company like Zomato or Nykaa wants to raise money from the public for the first time, it does an Initial Public Offering (IPO). The company decides how many shares to sell and at what price. After the IPO, these shares are traded on stock exchanges, people buy and sell them freely, and the price fluctuates based on supply and demand, company performance, and market sentiment.",
              "Owning a share makes you a part-owner of the company. If you own 100 shares of Infosys out of its ~415 crore total shares, you own a tiny fraction. But you still have rights, you can vote on major company decisions, receive dividends (a share of profits), and benefit if the stock price rises. Of course, if the company performs poorly, your shares lose value too.",
            ],
          },
        },
        {
          type: "key-term",
          data: {
            term: "IPO (Initial Public Offering)",
            definition:
              "The first time a private company sells its shares to the general public on a stock exchange. It's how companies raise large amounts of capital and how everyday investors get a chance to own a piece of the company.",
          },
        },
        {
          type: "callout",
          data: {
            variant: "tip",
            text: "You don't need lakhs to start investing in stocks. With apps like Zerodha or Groww, you can buy even 1 share. Some good companies have shares priced under Rs 500!",
          },
        },
        {
          type: "image",
          data: {
            url: "/images/lessons/stock-ownership.svg",
            alt: "Illustration of stock ownership concept",
            caption:
              "Buying a stock means buying a small ownership stake in a company.",
          },
        },
        {
          type: "text",
          data: {
            paragraphs: [
              "The price of a stock is determined by what buyers are willing to pay and what sellers are willing to accept. If many people want to buy a stock (high demand) and few want to sell (low supply), the price goes up. If more people want to sell than buy, the price drops. News, quarterly results, government policies, and even social media trends can move stock prices dramatically.",
            ],
          },
        },
      ],
    },
    exercises: [
      {
        type: "mcq-single",
        prompt: "What does it mean to own a share of a company?",
        options: [
          { text: "You own the company's office building", isCorrect: false },
          { text: "You are a part-owner of the company", isCorrect: true },
          { text: "You are an employee of the company", isCorrect: false },
          { text: "You have lent money to the company", isCorrect: false },
        ],
        explanation:
          "When you buy shares, you become a part-owner (shareholder) of the company. You have ownership rights proportional to the number of shares you hold, including voting rights and dividend entitlements.",
        xpValue: 10,
      },
      {
        type: "true-false",
        prompt:
          "An IPO is when a company sells its shares to the public for the first time.",
        options: [
          { text: "True", isCorrect: true },
          { text: "False", isCorrect: false },
        ],
        explanation:
          "True! IPO stands for Initial Public Offering, it's the very first time a company offers shares for sale to the general public on a stock exchange.",
        xpValue: 10,
      },
      {
        type: "scenario",
        prompt:
          "A company announces record profits and beats all analyst expectations. What would you generally expect to happen to its stock price?",
        options: [
          {
            text: "The price will likely increase as more investors want to buy",
            isCorrect: true,
          },
          {
            text: "The price will definitely drop because profits mean higher taxes",
            isCorrect: false,
          },
          {
            text: "Nothing, profits don't affect stock prices",
            isCorrect: false,
          },
          {
            text: "The stock will be delisted from the exchange",
            isCorrect: false,
          },
        ],
        explanation:
          "Strong profits generally increase demand for a company's shares, pushing the price up. However, markets can sometimes behave unexpectedly, if the profits were already 'priced in' (investors expected it), the reaction might be muted. But generally, beating expectations = price goes up.",
        xpValue: 15,
      },
      {
        type: "mcq-multi",
        prompt: "Which of the following are rights you get as a shareholder? (Select all that apply)",
        options: [
          { text: "Vote on major company decisions", isCorrect: true },
          { text: "Receive dividends when the company distributes profits", isCorrect: true },
          { text: "Fire the CEO whenever you want", isCorrect: false },
          { text: "Benefit from stock price appreciation", isCorrect: true },
        ],
        explanation:
          "Shareholders have the right to vote at annual general meetings, receive dividends, and benefit from price appreciation. However, individual small shareholders cannot unilaterally fire executives, major decisions require majority votes.",
        xpValue: 15,
      },
    ],
  },
  {
    chapterNumber: 1,
    lessonNumber: "1.2",
    title: "BSE, NSE, Sensex & Nifty Explained",
    estimatedMinutes: 10,
    order: 1,
    content: {
      blocks: [
        {
          type: "text",
          data: {
            paragraphs: [
              "India has two major stock exchanges: the Bombay Stock Exchange (BSE), established in 1875, making it Asia's oldest stock exchange, and the National Stock Exchange (NSE), established in 1992 as India's first electronic exchange. Think of them as marketplaces where buyers and sellers of stocks come together, just like Amazon is a marketplace for products.",
              "Now you've probably heard news anchors say 'Sensex crashed 500 points' or 'Nifty hits all-time high'. Sensex and Nifty are stock market indices, they track the performance of a basket of top companies. Sensex (from BSE) tracks 30 major companies, while Nifty 50 (from NSE) tracks 50. When people say 'the market went up', they usually mean these indices went up.",
              "An index is calculated as a weighted average, bigger companies have more influence on the number. So if Reliance (the largest company by market cap) has a great day, it can pull the entire Nifty up even if other stocks are down. This is important to understand: the index doesn't represent every stock, just the heavyweights.",
            ],
          },
        },
        {
          type: "key-term",
          data: {
            term: "Market Index",
            definition:
              "A statistical measure that tracks the performance of a group of stocks representing a portion of the market. Sensex (30 stocks on BSE) and Nifty 50 (50 stocks on NSE) are India's two most-followed indices.",
          },
        },
        {
          type: "callout",
          data: {
            variant: "tip",
            text: "You can actually invest directly in an index through Index Funds or ETFs. Instead of picking individual stocks, you buy a fund that mirrors the Nifty 50. If the index goes up 12%, your investment goes up roughly 12% too. It's one of the simplest ways to start investing!",
          },
        },
        {
          type: "image",
          data: {
            url: "/images/lessons/bse-nse-indices.svg",
            alt: "Comparison of BSE and NSE with their indices",
            caption:
              "BSE and NSE are India's two stock exchanges, tracked by Sensex and Nifty respectively.",
          },
        },
      ],
    },
    exercises: [
      {
        type: "mcq-single",
        prompt: "How many companies does the Sensex track?",
        options: [
          { text: "50 companies on NSE", isCorrect: false },
          { text: "30 companies on BSE", isCorrect: true },
          { text: "100 companies across both exchanges", isCorrect: false },
          { text: "All listed companies in India", isCorrect: false },
        ],
        explanation:
          "Sensex tracks 30 of the largest and most actively traded companies on the Bombay Stock Exchange (BSE). Nifty 50 is the one that tracks 50 companies, on the NSE.",
        xpValue: 10,
      },
      {
        type: "true-false",
        prompt:
          "The BSE, established in 1875, is the oldest stock exchange in Asia.",
        options: [
          { text: "True", isCorrect: true },
          { text: "False", isCorrect: false },
        ],
        explanation:
          "True! The Bombay Stock Exchange was established in 1875 and is indeed the oldest stock exchange in Asia and one of the oldest in the world.",
        xpValue: 10,
      },
      {
        type: "mcq-single",
        prompt:
          "If Reliance Industries (the largest company in Nifty 50) drops 5% but all other 49 stocks rise 1%, what would likely happen to the Nifty?",
        options: [
          {
            text: "Nifty would definitely go up because 49 stocks rose",
            isCorrect: false,
          },
          {
            text: "The impact depends on weightage, Reliance's drop could drag the index down despite others rising",
            isCorrect: true,
          },
          {
            text: "Nifty only tracks Reliance, so it would drop 5%",
            isCorrect: false,
          },
          { text: "Indices are not affected by individual stock movements", isCorrect: false },
        ],
        explanation:
          "Nifty is a weighted index, larger companies have more influence. A 5% drop in Reliance (which has ~10% weightage) could outweigh small gains in many other stocks. This is why weighted indices don't always reflect what 'most stocks' are doing.",
        xpValue: 15,
      },
    ],
  },

  // ─── Chapter 2: Investing 101 ────────────────────────────────────────
  {
    chapterNumber: 2,
    lessonNumber: "2.1",
    title: "Saving vs Investing: The Critical Difference",
    estimatedMinutes: 10,
    order: 0,
    content: {
      blocks: [
        {
          type: "text",
          data: {
            paragraphs: [
              "Most Indian families teach us to save, put money in a fixed deposit, keep it safe, don't take risks. And saving is genuinely important! But here's the uncomfortable truth: if your savings account gives you 4% interest and inflation is 6%, your money is actually losing 2% of its purchasing power every year. That Rs 1,00,000 in your savings account can buy less next year than it can today.",
              "Investing is different from saving. When you save, you preserve your money. When you invest, you put your money to work, buying assets like stocks, mutual funds, or real estate that have the potential to grow faster than inflation. The trade-off? Risk. Investments can go down in value, especially in the short term. But historically, over long periods (10+ years), equity investments have beaten inflation by a wide margin.",
              "The key insight is that both saving AND investing have their place. Your emergency fund? That should be in savings, safe and accessible. Your retirement corpus that you won't need for 20 years? That should be invested, working hard and growing. Understanding when to save and when to invest is one of the most important financial skills you can develop.",
            ],
          },
        },
        {
          type: "key-term",
          data: {
            term: "Inflation",
            definition:
              "The rate at which prices of goods and services increase over time. If inflation is 6%, something that costs Rs 100 today will cost Rs 106 next year. It's the silent wealth destroyer that makes 'just saving' insufficient.",
          },
        },
        {
          type: "callout",
          data: {
            variant: "important",
            text: "Rule of thumb: if you need the money within 1-2 years, save it (FD, savings account). If you won't need it for 5+ years, invest it (mutual funds, stocks). The longer your time horizon, the more risk you can afford to take.",
          },
        },
        {
          type: "image",
          data: {
            url: "/images/lessons/saving-vs-investing.svg",
            alt: "Graph comparing savings account growth vs investment growth over 20 years",
            caption:
              "Over 20 years, the gap between saving at 4% and investing at 12% becomes enormous due to compounding.",
          },
        },
      ],
    },
    exercises: [
      {
        type: "mcq-single",
        prompt:
          "If inflation is 6% and your savings account pays 4% interest, what is happening to your purchasing power?",
        options: [
          { text: "It's growing by 4% per year", isCorrect: false },
          { text: "It's shrinking by approximately 2% per year", isCorrect: true },
          { text: "It's staying exactly the same", isCorrect: false },
          { text: "It's growing by 10% (6% + 4%)", isCorrect: false },
        ],
        explanation:
          "When inflation (6%) exceeds your returns (4%), your real return is approximately -2%. While your bank balance grows, the things you can buy with that money actually decrease each year. This is why investing is essential for long-term wealth.",
        xpValue: 10,
      },
      {
        type: "scenario",
        prompt:
          "You receive Rs 5,00,000 as a gift. You need Rs 1,00,000 for expenses this year and won't need the rest for at least 10 years. What's the smartest allocation?",
        options: [
          {
            text: "Put all Rs 5,00,000 in a savings account for safety",
            isCorrect: false,
          },
          {
            text: "Keep Rs 1,00,000 in savings and invest Rs 4,00,000 in diversified mutual funds",
            isCorrect: true,
          },
          {
            text: "Invest all Rs 5,00,000 in stocks for maximum growth",
            isCorrect: false,
          },
          {
            text: "Put it all in a 10-year fixed deposit",
            isCorrect: false,
          },
        ],
        explanation:
          "The smart approach is to match your money with your time horizon. Keep what you need soon (Rs 1,00,000) in safe, accessible savings. Invest the rest in growth assets like mutual funds since you have 10 years, enough time to ride out market ups and downs and benefit from long-term compounding.",
        xpValue: 15,
      },
      {
        type: "true-false",
        prompt:
          "Historically, equity investments in India have outperformed inflation over periods of 10 years or more.",
        options: [
          { text: "True", isCorrect: true },
          { text: "False", isCorrect: false },
        ],
        explanation:
          "True! The Nifty 50 has delivered approximately 12-14% annualized returns over most 10-year periods, significantly beating inflation (typically 5-7%). While short-term returns can be negative, long-term equity investing has consistently beaten inflation in India.",
        xpValue: 10,
      },
      {
        type: "mcq-single",
        prompt: "Which of the following is the BEST place for your emergency fund?",
        options: [
          { text: "Stocks, they give the highest returns", isCorrect: false },
          { text: "Gold jewelry, it's a traditional safe haven", isCorrect: false },
          { text: "A savings account or liquid fund, safe and quickly accessible", isCorrect: true },
          { text: "Cryptocurrency, it's the future of money", isCorrect: false },
        ],
        explanation:
          "An emergency fund needs to be safe (won't lose value suddenly) and liquid (you can access it immediately). Savings accounts and liquid mutual funds fit both criteria. Stocks, gold jewelry, and crypto can all lose significant value in the short term or take time to liquidate.",
        xpValue: 10,
      },
    ],
  },
  {
    chapterNumber: 2,
    lessonNumber: "2.2",
    title: "The Magic of Compound Interest",
    estimatedMinutes: 12,
    order: 1,
    content: {
      blocks: [
        {
          type: "text",
          data: {
            paragraphs: [
              "Albert Einstein reportedly called compound interest the 'eighth wonder of the world', and when you see the math, you'll understand why. Simple interest pays you a fixed amount on your original investment. Compound interest pays you interest on your interest. The difference over time is mind-blowing.",
              "Here's a concrete example: If you invest Rs 1,00,000 at 12% simple interest for 30 years, you'll earn Rs 3,60,000 in interest (total: Rs 4,60,000). With compound interest at the same rate? You'll end up with Rs 29,96,000. That's nearly 30 lakh from the same 1 lakh, the extra Rs 25,36,000 is pure compounding magic. The interest earns interest, which earns more interest, creating an exponential snowball effect.",
              "This is why starting early matters so much. If you start a Rs 5,000/month SIP at age 20 and earn 12% annually, you'll have approximately Rs 3.25 crore by age 50. If you wait until age 30 to start the same SIP, you'll have only about Rs 95 lakh by age 50, that 10-year head start is worth over Rs 2.3 crore! Time is the most powerful ingredient in the compounding recipe.",
            ],
          },
        },
        {
          type: "key-term",
          data: {
            term: "SIP (Systematic Investment Plan)",
            definition:
              "A method of investing a fixed amount regularly (usually monthly) into a mutual fund. It automates investing, builds discipline, and takes advantage of rupee cost averaging, buying more units when prices are low and fewer when prices are high.",
          },
        },
        {
          type: "callout",
          data: {
            variant: "tip",
            text: "The Rule of 72: Divide 72 by your annual return rate to estimate how many years it takes for your money to double. At 12% return, money doubles in ~6 years. At 8%, it doubles in ~9 years. Simple and powerful!",
          },
        },
        {
          type: "image",
          data: {
            url: "/images/lessons/compound-interest-graph.svg",
            alt: "Graph showing exponential growth of compound interest vs linear growth of simple interest",
            caption:
              "Compound interest creates exponential growth, the earlier you start, the more dramatic the effect.",
          },
        },
        {
          type: "text",
          data: {
            paragraphs: [
              "Mutual funds are one of the most accessible ways to harness compound interest. A mutual fund pools money from many investors and is managed by a professional fund manager. Through SIPs (Systematic Investment Plans), you can invest as little as Rs 500 per month. The fund manager diversifies your money across many stocks or bonds, reducing risk while still capturing long-term growth.",
            ],
          },
        },
      ],
    },
    exercises: [
      {
        type: "mcq-single",
        prompt:
          "Using the Rule of 72, approximately how long will it take for your money to double at a 12% annual return?",
        options: [
          { text: "3 years", isCorrect: false },
          { text: "6 years", isCorrect: true },
          { text: "12 years", isCorrect: false },
          { text: "72 years", isCorrect: false },
        ],
        explanation:
          "The Rule of 72: 72 / 12 = 6. At a 12% annual return, your money approximately doubles every 6 years. So Rs 1 lakh becomes Rs 2 lakh in 6 years, Rs 4 lakh in 12 years, Rs 8 lakh in 18 years, and so on.",
        xpValue: 10,
      },
      {
        type: "scenario",
        prompt:
          "Two friends both invest in the same mutual fund earning 12% annually. Priya starts at age 22 with Rs 3,000/month. Rahul starts at age 32 with Rs 6,000/month (double Priya's amount). Who has more money at age 52?",
        options: [
          {
            text: "Rahul, he invests double the amount each month",
            isCorrect: false,
          },
          {
            text: "Priya, her extra 10 years of compounding more than compensates for the lower monthly amount",
            isCorrect: true,
          },
          { text: "They'll have roughly the same amount", isCorrect: false },
          {
            text: "It depends entirely on market conditions",
            isCorrect: false,
          },
        ],
        explanation:
          "Priya invests for 30 years (Rs 3,000 x 360 months = Rs 10.8 lakh invested) and ends up with approximately Rs 1.05 crore. Rahul invests for 20 years (Rs 6,000 x 240 months = Rs 14.4 lakh invested) and ends up with approximately Rs 60 lakh. Priya wins despite investing less total money, that's the power of time + compounding!",
        xpValue: 15,
      },
      {
        type: "true-false",
        prompt:
          "You need at least Rs 10,000 per month to start a SIP in a mutual fund.",
        options: [
          { text: "True", isCorrect: false },
          { text: "False", isCorrect: true },
        ],
        explanation:
          "False! Most mutual funds allow SIPs starting from just Rs 500 per month. Some even allow Rs 100. The key is to start early, even if the amount is small, thanks to compounding, those small amounts grow significantly over time.",
        xpValue: 10,
      },
    ],
  },

  // ─── Chapter 3: Your Money Psychology ────────────────────────────────
  {
    chapterNumber: 3,
    lessonNumber: "3.1",
    title: "Behavioral Biases: Why We Spend Irrationally",
    estimatedMinutes: 10,
    order: 0,
    content: {
      blocks: [
        {
          type: "text",
          data: {
            paragraphs: [
              "You walk into a store and see a jacket with a tag: 'Was Rs 5,000, Now Rs 2,500, 50% OFF!' You weren't planning to buy a jacket, but that feels like an amazing deal, right? This is anchoring bias, your brain latches onto the original price (Rs 5,000) as a reference point, making Rs 2,500 feel like a steal, even though you didn't need the jacket at all and it might actually be worth only Rs 1,500.",
              "We like to think of ourselves as rational beings who make logical money decisions. The truth? Our brains are riddled with psychological shortcuts (called heuristics) that worked great for survival in the wild but wreak havoc on our finances. Marketers, apps, and even financial products are specifically designed to exploit these biases.",
              "Some of the most common biases include loss aversion (we feel losses about twice as strongly as equivalent gains, losing Rs 1,000 hurts way more than gaining Rs 1,000 feels good), herd mentality (everyone's buying crypto, so I should too!), and present bias (we heavily prefer Rs 100 today over Rs 200 next year). Recognizing these patterns in yourself is the first step to making better financial decisions.",
            ],
          },
        },
        {
          type: "key-term",
          data: {
            term: "Anchoring Bias",
            definition:
              "The tendency to rely too heavily on the first piece of information encountered (the 'anchor'). In shopping, the original MRP serves as an anchor, making any discounted price feel like a bargain, even if the discounted price is still overpriced.",
          },
        },
        {
          type: "callout",
          data: {
            variant: "tip",
            text: "Next time you see a 'sale', ask yourself: 'Would I buy this at this price if there was no original price shown?' This simple question defuses the anchoring bias and helps you evaluate the actual value of what you're buying.",
          },
        },
        {
          type: "image",
          data: {
            url: "/images/lessons/behavioral-biases.svg",
            alt: "Illustrations of common behavioral biases in financial decisions",
            caption:
              "Our brains use mental shortcuts that can lead to costly financial mistakes.",
          },
        },
      ],
    },
    exercises: [
      {
        type: "scenario",
        prompt:
          "You see a phone on sale: 'MRP Rs 25,000, Sale Price Rs 15,000'. You weren't planning to buy a phone, but it feels like you're saving Rs 10,000. Which cognitive bias is at play?",
        options: [
          { text: "Loss aversion, you're afraid of losing the deal", isCorrect: false },
          {
            text: "Anchoring bias, the MRP makes the sale price seem like a bargain",
            isCorrect: true,
          },
          { text: "Herd mentality, everyone else is buying it", isCorrect: false },
          { text: "Confirmation bias, you only see what you want to see", isCorrect: false },
        ],
        explanation:
          "The Rs 25,000 MRP is the anchor, it makes Rs 15,000 feel like a great deal. But the real question is: is the phone actually worth Rs 15,000 to you? And did you even need a new phone? The anchor distracts you from evaluating the purchase on its own merits.",
        xpValue: 15,
      },
      {
        type: "mcq-single",
        prompt:
          "Loss aversion means that:",
        options: [
          { text: "We try to avoid all financial losses at any cost", isCorrect: false },
          {
            text: "The pain of losing money feels roughly twice as strong as the pleasure of gaining the same amount",
            isCorrect: true,
          },
          { text: "We always make rational decisions about losses", isCorrect: false },
          { text: "We prefer to invest in things that never lose value", isCorrect: false },
        ],
        explanation:
          "Loss aversion, discovered by psychologists Kahneman and Tversky, shows that losses feel about 2x as powerful as equivalent gains. This is why people hold onto losing stocks too long (not wanting to 'realize' the loss) and sell winning stocks too early (locking in the gain before it disappears).",
        xpValue: 10,
      },
      {
        type: "true-false",
        prompt:
          "If all your friends are investing in a particular stock, it's usually a good idea to follow them.",
        options: [
          { text: "True", isCorrect: false },
          { text: "False", isCorrect: true },
        ],
        explanation:
          "False! This is herd mentality, following the crowd without doing your own research. By the time 'everyone' is buying something, the price is often already inflated. Many market bubbles (like the dot-com crash or crypto peaks) were fueled by herd mentality.",
        xpValue: 10,
      },
      {
        type: "mcq-single",
        prompt:
          "An online shopping app shows 'Only 2 left in stock!' and a countdown timer. Which bias are they exploiting?",
        options: [
          { text: "Anchoring bias", isCorrect: false },
          { text: "Confirmation bias", isCorrect: false },
          {
            text: "Scarcity bias and urgency, creating FOMO to rush your decision",
            isCorrect: true,
          },
          { text: "Sunk cost fallacy", isCorrect: false },
        ],
        explanation:
          "Scarcity bias makes us value things more when they seem limited. The countdown timer adds urgency. Together, they create FOMO (Fear of Missing Out) and push you to buy impulsively without properly evaluating whether you need the product.",
        xpValue: 10,
      },
    ],
  },
  {
    chapterNumber: 3,
    lessonNumber: "3.2",
    title: "Wants vs Needs: The Spending Framework",
    estimatedMinutes: 8,
    order: 1,
    content: {
      blocks: [
        {
          type: "text",
          data: {
            paragraphs: [
              "Here's a powerful exercise: before any purchase over Rs 500, ask yourself, 'Is this a need or a want?' A need is something essential for survival and basic functioning: food, shelter, basic clothing, healthcare, and transportation to work. A want is everything else: the latest iPhone, eating out at restaurants, brand-name clothes, Netflix subscriptions.",
              "The tricky part? Our brain is excellent at disguising wants as needs. 'I need this new phone because my old one is slow' (want, your old phone still works). 'I need to eat out because I'm stressed' (want, cooking at home costs a fraction). 'I need branded shoes for the office' (often a want, functional shoes exist at lower prices). Being brutally honest about this distinction is the foundation of good money management.",
              "This doesn't mean you should never spend on wants! Wants make life enjoyable. The goal is conscious spending, deliberately choosing which wants bring you the most happiness per rupee spent. A Rs 200 movie with friends might bring more joy than a Rs 2,000 shirt you'll wear twice. Financial literacy isn't about deprivation, it's about intentionality.",
            ],
          },
        },
        {
          type: "key-term",
          data: {
            term: "Lifestyle Inflation",
            definition:
              "The tendency to increase spending as income rises. When you get a raise of Rs 10,000, you 'upgrade' your lifestyle by Rs 10,000, fancier meals, a better apartment, new gadgets, so your savings stay flat despite earning more. This is one of the biggest wealth destroyers.",
          },
        },
        {
          type: "callout",
          data: {
            variant: "tip",
            text: "Try the 24-hour rule: for any non-essential purchase over Rs 1,000, wait 24 hours before buying. You'll be surprised how many 'must-have' items feel unnecessary the next day. This simple pause breaks the impulse-buying cycle.",
          },
        },
        {
          type: "image",
          data: {
            url: "/images/lessons/wants-vs-needs.svg",
            alt: "Visual framework showing needs vs wants categorization",
            caption:
              "Distinguishing needs from wants is the first step to mastering your spending.",
          },
        },
      ],
    },
    exercises: [
      {
        type: "mcq-multi",
        prompt: "Which of the following are genuine needs? (Select all that apply)",
        options: [
          { text: "Groceries for home cooking", isCorrect: true },
          { text: "The latest iPhone model", isCorrect: false },
          { text: "Health insurance premiums", isCorrect: true },
          { text: "A Netflix subscription", isCorrect: false },
        ],
        explanation:
          "Groceries and health insurance are genuine needs, they're essential for survival and protection. The latest iPhone and Netflix are wants, enjoyable, but not necessary. You can communicate with an older phone and entertain yourself without streaming services.",
        xpValue: 10,
      },
      {
        type: "scenario",
        prompt:
          "You get a 30% salary hike from Rs 50,000 to Rs 65,000 per month. Your friend suggests upgrading your apartment (extra Rs 8,000/month) and getting a car loan (Rs 7,000 EMI). What's the wisest approach?",
        options: [
          {
            text: "Upgrade everything, you've earned it and deserve a better lifestyle",
            isCorrect: false,
          },
          {
            text: "Keep your current lifestyle and invest the entire Rs 15,000 increase",
            isCorrect: false,
          },
          {
            text: "Allow a small lifestyle upgrade (maybe Rs 5,000) and invest the remaining Rs 10,000",
            isCorrect: true,
          },
          {
            text: "Save the entire amount in a savings account",
            isCorrect: false,
          },
        ],
        explanation:
          "The balanced approach avoids both extreme deprivation and full lifestyle inflation. Allowing a small upgrade keeps you motivated, while investing Rs 10,000/month at 12% returns grows to about Rs 1 crore in 20 years. The key is to save/invest the majority of any raise.",
        xpValue: 15,
      },
      {
        type: "true-false",
        prompt:
          "Lifestyle inflation means that as your income increases, your spending increases proportionally, keeping your savings flat.",
        options: [
          { text: "True", isCorrect: true },
          { text: "False", isCorrect: false },
        ],
        explanation:
          "True! Lifestyle inflation (or lifestyle creep) is when your spending rises in lockstep with your income. You earn more, but you also spend more on a bigger apartment, fancier food, and newer gadgets, so your actual savings never grow.",
        xpValue: 10,
      },
    ],
  },

  // ─── Chapter 4: Managing Your Money ──────────────────────────────────
  {
    chapterNumber: 4,
    lessonNumber: "4.1",
    title: "Income, Expenses & Your First Budget",
    estimatedMinutes: 12,
    order: 0,
    content: {
      blocks: [
        {
          type: "text",
          data: {
            paragraphs: [
              "A budget isn't a punishment, it's a plan that tells your money where to go instead of wondering where it went. The most popular and beginner-friendly budgeting framework is the 50/30/20 rule: 50% of your after-tax income goes to needs, 30% to wants, and 20% to savings and investments.",
              "Let's say you earn Rs 40,000 per month after taxes. Under the 50/30/20 rule: Rs 20,000 goes to needs (rent, groceries, utilities, insurance, transport), Rs 12,000 goes to wants (eating out, shopping, entertainment, subscriptions), and Rs 8,000 goes to savings and investments (emergency fund, SIPs, debt repayment). These are starting guidelines, you can adjust them to your situation.",
              "The first step to budgeting is tracking. For one month, write down every single expense, yes, even that Rs 20 tea. Most people are shocked to discover how much they spend on small, forgettable purchases. Digital payment apps like Google Pay and PhonePe actually make this easier, you can review your transaction history to see exactly where your money goes.",
            ],
          },
        },
        {
          type: "key-term",
          data: {
            term: "50/30/20 Rule",
            definition:
              "A simple budgeting framework that allocates 50% of after-tax income to needs (essentials), 30% to wants (lifestyle), and 20% to savings, investments, and debt repayment. It's a starting point that you can customize to your financial situation and goals.",
          },
        },
        {
          type: "callout",
          data: {
            variant: "tip",
            text: "Automate your 20%: Set up an auto-transfer of 20% of your salary to a separate savings/investment account on payday. If it leaves your account before you see it, you won't miss it. This is called 'paying yourself first' and it's the single most effective budgeting habit.",
          },
        },
        {
          type: "image",
          data: {
            url: "/images/lessons/50-30-20-budget.svg",
            alt: "Pie chart showing the 50/30/20 budget breakdown",
            caption:
              "The 50/30/20 rule provides a simple framework to manage your income effectively.",
          },
        },
        {
          type: "text",
          data: {
            paragraphs: [
              "One common mistake is creating an overly restrictive budget that you abandon after a week. Budgeting should be sustainable. If your 'wants' category is too small, you'll feel deprived and binge-spend. If your 'needs' category is genuinely more than 50% (common in expensive cities), adjust the ratios, maybe 60/20/20. The best budget is one you actually follow.",
            ],
          },
        },
      ],
    },
    exercises: [
      {
        type: "mcq-single",
        prompt:
          "Using the 50/30/20 rule on a Rs 60,000 monthly income, how much should go to wants?",
        options: [
          { text: "Rs 30,000", isCorrect: false },
          { text: "Rs 18,000", isCorrect: true },
          { text: "Rs 12,000", isCorrect: false },
          { text: "Rs 6,000", isCorrect: false },
        ],
        explanation:
          "Wants get 30% of your income. 30% of Rs 60,000 = Rs 18,000. This covers eating out, entertainment, shopping, subscriptions, and other non-essential spending.",
        xpValue: 10,
      },
      {
        type: "scenario",
        prompt:
          "You earn Rs 35,000/month. Your rent alone is Rs 15,000, and essential expenses (food, transport, utilities) are Rs 10,000. That's already 71% on needs. How should you adapt the 50/30/20 rule?",
        options: [
          {
            text: "Stick strictly to 50/30/20 and find a way to cut Rs 7,500 from needs",
            isCorrect: false,
          },
          {
            text: "Adapt to maybe 70/15/15, reduce wants, but still save something",
            isCorrect: true,
          },
          { text: "Don't save anything until your income increases", isCorrect: false },
          {
            text: "Take a loan to cover the gap",
            isCorrect: false,
          },
        ],
        explanation:
          "The 50/30/20 rule is a guideline, not a rigid law. If your needs genuinely exceed 50%, adjust the other categories proportionally. Even saving 15% (Rs 5,250) is much better than saving nothing. The key is to always save something and look for ways to either increase income or reduce costs over time.",
        xpValue: 15,
      },
      {
        type: "true-false",
        prompt:
          "'Paying yourself first' means spending on what makes you happy before paying bills.",
        options: [
          { text: "True", isCorrect: false },
          { text: "False", isCorrect: true },
        ],
        explanation:
          "False! 'Paying yourself first' means automatically setting aside your savings/investment amount before spending on anything else. It means your future self gets paid first, through an automatic transfer on payday, before your current self gets to spend.",
        xpValue: 10,
      },
      {
        type: "mcq-single",
        prompt:
          "Why is tracking every expense for a month recommended as a first budgeting step?",
        options: [
          { text: "To punish yourself for overspending", isCorrect: false },
          {
            text: "To get an accurate picture of where your money actually goes before creating a plan",
            isCorrect: true,
          },
          { text: "Because banks require it for loan applications", isCorrect: false },
          { text: "To impress your financial advisor", isCorrect: false },
        ],
        explanation:
          "You can't manage what you don't measure. Most people vastly underestimate how much they spend on small purchases (coffee, snacks, auto rides). Tracking for even one month reveals your real spending patterns and highlights the biggest areas where you can save.",
        xpValue: 10,
      },
    ],
  },
  {
    chapterNumber: 4,
    lessonNumber: "4.2",
    title: "Emergency Funds: Your Financial Safety Net",
    estimatedMinutes: 8,
    order: 1,
    content: {
      blocks: [
        {
          type: "text",
          data: {
            paragraphs: [
              "Life is unpredictable. Your laptop could break, you might need unexpected medical care, or you could lose your income source. An emergency fund is a dedicated pot of money set aside for these unplanned expenses. Without one, a single emergency can push you into debt, and debt spirals are one of the biggest financial traps in India.",
              "The standard advice is to save 3-6 months of essential expenses (not income, just the must-pay bills). If your monthly needs are Rs 20,000, aim for Rs 60,000 to Rs 1,20,000 in your emergency fund. If you're a freelancer or have irregular income, aim for 6-9 months since your income is less predictable.",
              "Where should you keep it? Your emergency fund needs two properties: safety (it shouldn't lose value) and liquidity (you can access it within 24 hours). A savings account or a liquid mutual fund works perfectly. Do NOT put your emergency fund in stocks, fixed deposits with lock-in, or anything that might lose value or be inaccessible when you need it most.",
            ],
          },
        },
        {
          type: "key-term",
          data: {
            term: "Liquidity",
            definition:
              "How quickly and easily an asset can be converted to cash without losing value. Cash in a savings account is highly liquid. A house is highly illiquid, selling it takes months. Emergency funds must be in liquid assets.",
          },
        },
        {
          type: "callout",
          data: {
            variant: "important",
            text: "Building an emergency fund should be your FIRST financial priority, even before investing. Without this safety net, one bad month can force you to sell investments at a loss, take high-interest loans, or worse. Think of it as your financial seatbelt.",
          },
        },
        {
          type: "image",
          data: {
            url: "/images/lessons/emergency-fund.svg",
            alt: "Illustration of emergency fund as a safety net",
            caption:
              "An emergency fund is the foundation of financial health, build it before investing.",
          },
        },
      ],
    },
    exercises: [
      {
        type: "mcq-single",
        prompt:
          "If your essential monthly expenses are Rs 25,000, what is the ideal emergency fund range?",
        options: [
          { text: "Rs 25,000 - Rs 50,000", isCorrect: false },
          { text: "Rs 75,000 - Rs 1,50,000", isCorrect: true },
          { text: "Rs 2,50,000 - Rs 5,00,000", isCorrect: false },
          { text: "Any amount you can save", isCorrect: false },
        ],
        explanation:
          "The rule of thumb is 3-6 months of essential expenses. At Rs 25,000/month, that's Rs 75,000 to Rs 1,50,000. This gives you enough runway to handle most emergencies or income disruptions without going into debt.",
        xpValue: 10,
      },
      {
        type: "true-false",
        prompt:
          "A fixed deposit with a 2-year lock-in is a good place for your emergency fund.",
        options: [
          { text: "True", isCorrect: false },
          { text: "False", isCorrect: true },
        ],
        explanation:
          "False! Emergency funds need to be immediately accessible (liquid). A fixed deposit with a lock-in period means you either can't access the money when you need it, or you'll pay a penalty for early withdrawal. Use a savings account or liquid mutual fund instead.",
        xpValue: 10,
      },
      {
        type: "scenario",
        prompt:
          "You have Rs 2,00,000 saved but no emergency fund. Your friend recommends investing it all in mutual funds that have been giving 15% returns. What's the best approach?",
        options: [
          {
            text: "Invest all Rs 2,00,000, the returns are too good to miss",
            isCorrect: false,
          },
          {
            text: "First set aside 3-6 months of expenses as an emergency fund, then invest the rest",
            isCorrect: true,
          },
          { text: "Keep all Rs 2,00,000 in savings, investing is too risky", isCorrect: false },
          {
            text: "Wait for the market to dip, then invest everything",
            isCorrect: false,
          },
        ],
        explanation:
          "Always build your emergency fund first. If you invest everything and then face an emergency, you'll be forced to sell your investments (possibly at a loss) or take an expensive loan. Set aside 3-6 months of expenses, then invest the remainder with confidence.",
        xpValue: 15,
      },
    ],
  },

  // ─── Chapter 5: Credit & Debt ────────────────────────────────────────
  {
    chapterNumber: 5,
    lessonNumber: "5.1",
    title: "Credit Cards, Loans & EMIs Decoded",
    estimatedMinutes: 10,
    order: 0,
    content: {
      blocks: [
        {
          type: "text",
          data: {
            paragraphs: [
              "A credit card is essentially a short-term loan that resets every month. When you swipe your card for Rs 5,000, the bank pays the merchant immediately and gives you 20-45 days to pay them back. If you pay the full amount by the due date, you pay zero interest. But if you pay only the 'minimum amount due' (usually 5% of the bill), the remaining balance starts accruing interest, and credit card interest rates in India are typically 30-42% per year. That's the highest interest rate on any common financial product.",
              "Let's put that in perspective: if you carry a Rs 1,00,000 credit card balance at 36% annual interest and only pay the minimum each month, it would take you over 8 years to pay it off and you'd pay over Rs 1,50,000 in interest, more than the original amount! Credit cards are fantastic tools when used correctly (free credit period, rewards, building credit history) but devastating when misused.",
              "Loans and EMIs work differently. When you take a home loan, car loan, or personal loan, you borrow a lump sum and repay it in fixed monthly installments (EMIs) that include both principal and interest. Home loans typically charge 8-10% interest, car loans 9-12%, and personal loans 12-20%. Always compare the total cost of the loan (principal + all interest over the entire tenure), not just the monthly EMI amount.",
            ],
          },
        },
        {
          type: "key-term",
          data: {
            term: "EMI (Equated Monthly Installment)",
            definition:
              "A fixed monthly payment made to repay a loan. Each EMI contains two components: interest (payment to the bank for lending you money) and principal (actual repayment of the borrowed amount). In the early years of a loan, most of your EMI goes toward interest.",
          },
        },
        {
          type: "callout",
          data: {
            variant: "important",
            text: "Golden rule: ALWAYS pay your credit card bill in full every month. The minimum amount due is a trap, it's designed to keep you in debt while maximizing the bank's interest income. If you can't pay the full bill, you're spending more than you can afford.",
          },
        },
        {
          type: "image",
          data: {
            url: "/images/lessons/credit-card-interest.svg",
            alt: "Chart showing how minimum payments extend debt repayment",
            caption:
              "Paying only the minimum balance on a Rs 1,00,000 credit card bill can cost you over Rs 1,50,000 in interest.",
          },
        },
        {
          type: "text",
          data: {
            paragraphs: [
              "Not all debt is bad. A home loan at 8% for an appreciating asset can be 'good debt'. A personal loan at 18% for a vacation is usually 'bad debt'. The test: does the debt help you build wealth or earn more? If yes, it might be justified. If no, avoid it.",
            ],
          },
        },
      ],
    },
    exercises: [
      {
        type: "mcq-single",
        prompt:
          "What is the typical annual interest rate on credit card balances in India?",
        options: [
          { text: "8-10%", isCorrect: false },
          { text: "15-20%", isCorrect: false },
          { text: "30-42%", isCorrect: true },
          { text: "5-8%", isCorrect: false },
        ],
        explanation:
          "Credit cards carry some of the highest interest rates in consumer finance, typically 30-42% per year (about 3% per month). This is why carrying a balance on your credit card is extremely expensive and should be avoided at all costs.",
        xpValue: 10,
      },
      {
        type: "true-false",
        prompt:
          "If you pay your credit card bill in full by the due date every month, you pay zero interest.",
        options: [
          { text: "True", isCorrect: true },
          { text: "False", isCorrect: false },
        ],
        explanation:
          "True! Credit cards offer a 'free credit period' of 20-45 days. If you pay the full statement balance by the due date, no interest is charged. The high interest rates only kick in when you carry a balance (pay less than the full amount).",
        xpValue: 10,
      },
      {
        type: "scenario",
        prompt:
          "You want to buy a Rs 80,000 laptop. You have two options: (A) pay the full amount from savings, or (B) 12-month no-cost EMI with a Rs 2,000 processing fee. You have Rs 1,50,000 in savings. Which is financially smarter?",
        options: [
          {
            text: "No-cost EMI, you keep your money and pay in installments",
            isCorrect: false,
          },
          {
            text: "Pay in full, you save the Rs 2,000 processing fee and avoid creating a debt habit",
            isCorrect: true,
          },
          {
            text: "Take a personal loan at lower interest instead",
            isCorrect: false,
          },
          {
            text: "Use a credit card and pay minimum balance each month",
            isCorrect: false,
          },
        ],
        explanation:
          "If you can comfortably afford the purchase from savings (you'll still have Rs 70,000 left), paying in full saves you the Rs 2,000 fee and keeps you debt-free. 'No-cost' EMIs often have hidden charges. The credit card minimum balance option is the worst, at 36% interest, that Rs 80,000 would cost you over Rs 1,20,000.",
        xpValue: 15,
      },
      {
        type: "mcq-single",
        prompt: "Which of the following is an example of 'good debt'?",
        options: [
          { text: "A personal loan for a vacation trip", isCorrect: false },
          { text: "Credit card debt from shopping sprees", isCorrect: false },
          {
            text: "An education loan for a degree that will increase your earning potential",
            isCorrect: true,
          },
          { text: "A loan to buy the latest gaming console", isCorrect: false },
        ],
        explanation:
          "Good debt is borrowing that helps you build wealth or increase earning potential. An education loan invests in your future income. A home loan builds a real asset. In contrast, borrowing for consumption (vacations, gadgets, shopping) is 'bad debt', it costs you interest on things that lose value.",
        xpValue: 10,
      },
    ],
  },
  {
    chapterNumber: 5,
    lessonNumber: "5.2",
    title: "Credit Scores: Your Financial Reputation",
    estimatedMinutes: 10,
    order: 1,
    content: {
      blocks: [
        {
          type: "text",
          data: {
            paragraphs: [
              "Your credit score is a three-digit number (ranging from 300 to 900) that tells lenders how trustworthy you are with borrowed money. In India, CIBIL (Credit Information Bureau India Limited) is the most widely used credit bureau. A score of 750+ is considered 'good' and gets you the best interest rates on loans. Below 650? You might struggle to get approved for any credit.",
              "Your CIBIL score is calculated based on several factors: payment history (35% weightage, do you pay bills on time?), credit utilization (30%, how much of your available credit are you using?), credit history length (15%, older accounts help), credit mix (10%, having different types of credit like a credit card and a loan), and new credit inquiries (10%, too many loan applications in a short period hurts your score).",
              "Here's what many people don't realize: your credit score follows you like a financial resume. When you apply for a home loan 10 years from now, the bank will check your entire credit history. That one credit card bill you forgot to pay in college? It could mean a higher interest rate on your Rs 50 lakh home loan, costing you lakhs extra over 20 years. Start building good credit habits early.",
            ],
          },
        },
        {
          type: "key-term",
          data: {
            term: "Credit Utilization Ratio",
            definition:
              "The percentage of your available credit that you're currently using. If your credit card has a Rs 1,00,000 limit and you've spent Rs 30,000, your utilization is 30%. Experts recommend keeping it below 30% for a healthy credit score.",
          },
        },
        {
          type: "callout",
          data: {
            variant: "tip",
            text: "You can check your CIBIL score for free once a year at cibil.com. Checking your own score (a 'soft inquiry') does NOT lower it. Only applications for new credit (a 'hard inquiry') can temporarily reduce your score.",
          },
        },
        {
          type: "image",
          data: {
            url: "/images/lessons/credit-score-factors.svg",
            alt: "Pie chart showing factors that affect your credit score",
            caption:
              "Your CIBIL score is determined by five key factors, with payment history being the most important.",
          },
        },
      ],
    },
    exercises: [
      {
        type: "mcq-single",
        prompt:
          "What is the most heavily weighted factor in your CIBIL credit score?",
        options: [
          { text: "Credit utilization (how much credit you use)", isCorrect: false },
          { text: "Payment history (paying bills on time)", isCorrect: true },
          { text: "Length of credit history", isCorrect: false },
          { text: "Number of credit cards you own", isCorrect: false },
        ],
        explanation:
          "Payment history carries about 35% weightage, it's the biggest factor. Consistently paying your credit card bills and loan EMIs on time is the single most impactful thing you can do for your credit score.",
        xpValue: 10,
      },
      {
        type: "mcq-single",
        prompt:
          "Your credit card has a Rs 2,00,000 limit. How much should you ideally spend per month to maintain a healthy credit score?",
        options: [
          { text: "Up to Rs 2,00,000, use the full limit!", isCorrect: false },
          { text: "Up to Rs 60,000, keep utilization under 30%", isCorrect: true },
          { text: "Rs 0, never use your credit card", isCorrect: false },
          { text: "It doesn't matter as long as you pay on time", isCorrect: false },
        ],
        explanation:
          "A credit utilization ratio below 30% is recommended. With a Rs 2,00,000 limit, that means spending no more than Rs 60,000. Going above 30% signals to credit bureaus that you might be over-reliant on credit, even if you pay in full.",
        xpValue: 10,
      },
      {
        type: "true-false",
        prompt:
          "Checking your own credit score on cibil.com will lower your credit score.",
        options: [
          { text: "True", isCorrect: false },
          { text: "False", isCorrect: true },
        ],
        explanation:
          "False! Checking your own score is a 'soft inquiry' and has zero impact on your credit score. Only 'hard inquiries' (when a bank checks your score because you applied for credit) can temporarily lower it. You should check your score regularly.",
        xpValue: 10,
      },
      {
        type: "scenario",
        prompt:
          "You're 22 and just got your first job. A friend says 'Don't get a credit card, they're debt traps.' What's the financially smart approach?",
        options: [
          {
            text: "Avoid credit cards entirely, they're dangerous",
            isCorrect: false,
          },
          {
            text: "Get a basic credit card, use it for small purchases, and always pay the full bill on time to build credit history",
            isCorrect: true,
          },
          {
            text: "Get multiple credit cards and max them all out",
            isCorrect: false,
          },
          {
            text: "Wait until you need a home loan to start building credit",
            isCorrect: false,
          },
        ],
        explanation:
          "A credit card used responsibly is one of the best tools to build credit history early. Use it for small, planned purchases and pay the full bill on time every month. By the time you need a home loan in your 30s, you'll have a strong credit score that gets you the lowest interest rates.",
        xpValue: 15,
      },
    ],
  },

  // ─── Chapter 6: The Shield - Fraud Protection ───────────────────────
  {
    chapterNumber: 6,
    lessonNumber: "6.1",
    title: "UPI Fraud & Phishing: How Scammers Trick You",
    estimatedMinutes: 10,
    order: 0,
    content: {
      blocks: [
        {
          type: "text",
          data: {
            paragraphs: [
              "India's UPI system processes over 10 billion transactions per month, and scammers love it. The most common UPI scam? Someone sends you a 'collect request' disguised as a payment. They call you saying 'I'm sending you Rs 5,000' but actually send a collect request. If you enter your PIN thinking you're receiving money, you're actually sending money. Remember: you NEVER need to enter your PIN to receive money.",
              "Phishing is another massive threat. You receive an SMS or email that looks exactly like it's from your bank: 'Your account has been compromised. Click here to verify immediately.' The link takes you to a fake website that looks identical to your bank's site. You enter your credentials, and they now have your username, password, and possibly your OTP. Banks process over Rs 100 crore in fraudulent transactions every year in India.",
              "Other common scams include: fake customer care numbers (you Google 'SBI customer care', call a fake number, and they ask for your card details), screen-sharing scams (someone asks you to install AnyDesk or TeamViewer for 'help' and then takes over your phone), and QR code scams (scanning a QR code to 'receive' money actually initiates a payment from your account).",
            ],
          },
        },
        {
          type: "key-term",
          data: {
            term: "Phishing",
            definition:
              "A fraudulent attempt to steal sensitive information (passwords, OTPs, card numbers) by impersonating a trusted entity like your bank, government, or a popular service. It typically comes via fake emails, SMS, or websites that look authentic.",
          },
        },
        {
          type: "callout",
          data: {
            variant: "important",
            text: "Three things your bank will NEVER ask for: your OTP, your UPI PIN, or your full card number. If anyone asks for these, whether by call, SMS, email, or in person, it's a scam. No exceptions.",
          },
        },
        {
          type: "image",
          data: {
            url: "/images/lessons/upi-fraud-types.svg",
            alt: "Common types of UPI fraud illustrated",
            caption:
              "UPI fraud comes in many forms, always verify before entering your PIN or clicking links.",
          },
        },
      ],
    },
    exercises: [
      {
        type: "mcq-single",
        prompt:
          "When do you need to enter your UPI PIN?",
        options: [
          { text: "When receiving money from someone", isCorrect: false },
          { text: "When sending money to someone", isCorrect: true },
          { text: "When checking your bank balance (it auto-fills)", isCorrect: false },
          { text: "Both when sending and receiving money", isCorrect: false },
        ],
        explanation:
          "You only enter your UPI PIN when you are sending money or authorizing a payment. You NEVER need to enter your PIN to receive money. This is the most important thing to remember to avoid UPI collect request scams.",
        xpValue: 10,
      },
      {
        type: "scenario",
        prompt:
          "You get an SMS: 'Dear SBI Customer, your account will be blocked in 24 hours. Click here to update KYC: bit.ly/sbi-kyc-update'. What should you do?",
        options: [
          { text: "Click the link immediately to save your account", isCorrect: false },
          { text: "Reply to the SMS with your account details", isCorrect: false },
          {
            text: "Ignore the SMS, contact SBI directly through their official app or by visiting a branch",
            isCorrect: true,
          },
          { text: "Forward it to friends to warn them, including the link", isCorrect: false },
        ],
        explanation:
          "This is a classic phishing SMS. Red flags: urgency ('24 hours'), shortened URL (bit.ly), and asking you to 'update KYC' via link. Banks send KYC notices through official channels and don't use shortened URLs. Always contact your bank directly, never through links in SMS or emails.",
        xpValue: 15,
      },
      {
        type: "true-false",
        prompt:
          "Scanning a QR code can deduct money from your account, not just add money.",
        options: [
          { text: "True", isCorrect: true },
          { text: "False", isCorrect: false },
        ],
        explanation:
          "True! A QR code can encode a payment request. Scammers create QR codes that, when scanned, initiate a payment FROM your account to theirs. Always check what the QR code scan shows before entering your PIN, verify the amount AND direction of the transaction.",
        xpValue: 10,
      },
      {
        type: "mcq-multi",
        prompt: "Which of the following are red flags of a financial scam? (Select all that apply)",
        options: [
          { text: "Someone asks for your OTP or UPI PIN", isCorrect: true },
          {
            text: "A message creates extreme urgency, 'Act within 1 hour or lose your account'",
            isCorrect: true,
          },
          {
            text: "You receive a transaction notification from your official bank app",
            isCorrect: false,
          },
          {
            text: "Someone asks you to install a screen-sharing app like AnyDesk",
            isCorrect: true,
          },
        ],
        explanation:
          "All three selected options are classic scam indicators. Asking for OTP/PIN, creating false urgency, and requesting screen-sharing access are tactics scammers use to steal your money. Official bank notifications through their app are legitimate.",
        xpValue: 15,
      },
    ],
  },
  {
    chapterNumber: 6,
    lessonNumber: "6.2",
    title: "Ponzi Schemes & Investment Fraud",
    estimatedMinutes: 10,
    order: 1,
    content: {
      blocks: [
        {
          type: "text",
          data: {
            paragraphs: [
              "In 2013, the Saradha Group scam rocked India, over Rs 2,500 crore was stolen from lakhs of small investors who were promised 'guaranteed' returns of 15-40%. The scheme collapsed because it was a Ponzi scheme: a fraudulent operation where returns to earlier investors are paid using money from newer investors, not from actual profits. When new investors stop joining, the whole thing collapses.",
              "Ponzi schemes follow a predictable pattern: they promise unusually high, guaranteed returns (anything above 15% 'guaranteed' annually should raise red flags). Early investors receive their promised returns (paid from new investors' money) and become vocal promoters. The scheme grows through word of mouth and social pressure. Eventually, the money runs out, the operator disappears, and the last wave of investors loses everything.",
              "How to spot investment fraud: be suspicious of 'guaranteed' high returns (no legitimate investment can guarantee returns), unregistered schemes (always check if the company is SEBI-registered), pressure to invest quickly ('limited spots!'), and complex or vague explanations of how returns are generated. If you can't clearly understand how a company makes money, don't invest your money in it.",
            ],
          },
        },
        {
          type: "key-term",
          data: {
            term: "Ponzi Scheme",
            definition:
              "A fraudulent investment scheme where returns are paid to existing investors from funds collected from new investors, rather than from profit earned. Named after Charles Ponzi who ran such a scheme in the 1920s. They inevitably collapse when new investment slows down.",
          },
        },
        {
          type: "callout",
          data: {
            variant: "important",
            text: "Always verify: is the company SEBI-registered? Is it listed on a recognized stock exchange? Can you find it on the RBI or SEBI website? If someone says 'This opportunity is too exclusive for SEBI registration', run. SEBI registration exists to protect you.",
          },
        },
        {
          type: "image",
          data: {
            url: "/images/lessons/ponzi-scheme-structure.svg",
            alt: "Diagram showing how a Ponzi scheme works and collapses",
            caption:
              "Ponzi schemes pay early investors with money from new ones, they always collapse eventually.",
          },
        },
      ],
    },
    exercises: [
      {
        type: "mcq-single",
        prompt:
          "In a Ponzi scheme, where do the 'returns' paid to early investors actually come from?",
        options: [
          { text: "Profits from smart investments made by the operator", isCorrect: false },
          { text: "Government subsidies", isCorrect: false },
          { text: "Money collected from newer investors", isCorrect: true },
          { text: "Interest from bank deposits", isCorrect: false },
        ],
        explanation:
          "In a Ponzi scheme, there are no real investments or profits. The money paid to early investors comes entirely from the deposits of newer investors. This is why the scheme must keep growing to survive, and why it inevitably collapses.",
        xpValue: 10,
      },
      {
        type: "scenario",
        prompt:
          "Your uncle excitedly tells you about an investment that gives 5% returns per month (60% annually), guaranteed. He's already invested Rs 2,00,000 and received 2 months of returns. He urges you to invest too. What do you do?",
        options: [
          { text: "Invest immediately, your uncle has already verified it works", isCorrect: false },
          { text: "Invest a small amount first to test it", isCorrect: false },
          {
            text: "Recognize the Ponzi scheme red flags and politely decline. Suggest your uncle withdraw his money while he still can.",
            isCorrect: true,
          },
          { text: "Report it to the police without telling your uncle", isCorrect: false },
        ],
        explanation:
          "60% annual 'guaranteed' returns is a massive red flag, no legitimate investment offers this. The fact that your uncle received 2 months of returns is exactly how Ponzi schemes build trust. Early investors get paid to create testimonials. The best thing is to help your uncle understand the risk and withdraw before the collapse.",
        xpValue: 15,
      },
      {
        type: "mcq-multi",
        prompt:
          "Which of the following are red flags of a potential Ponzi scheme or investment fraud? (Select all that apply)",
        options: [
          { text: "Guaranteed returns above 15% per year", isCorrect: true },
          { text: "The company is SEBI registered and publicly listed", isCorrect: false },
          { text: "Pressure to invest quickly before 'spots fill up'", isCorrect: true },
          { text: "Vague explanation of how the company generates profits", isCorrect: true },
        ],
        explanation:
          "All three selected options are classic red flags. Guaranteed high returns, urgency tactics, and vague business models are hallmarks of fraudulent schemes. A SEBI-registered, publicly listed company is actually a positive sign, it means there's regulatory oversight.",
        xpValue: 15,
      },
      {
        type: "true-false",
        prompt:
          "If early investors in a scheme are getting their promised returns, it proves the investment is legitimate.",
        options: [
          { text: "True", isCorrect: false },
          { text: "False", isCorrect: true },
        ],
        explanation:
          "False! This is exactly how Ponzi schemes build credibility. Early investors receive returns (paid from new investors' money) and become enthusiastic promoters. Getting returns in the early stages proves nothing about the legitimacy of the underlying investment.",
        xpValue: 10,
      },
    ],
  },
];
