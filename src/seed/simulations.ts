// Simulations are created with a placeholder chapterId that will be replaced during seeding.

export const simulations = [
  // ─── Chapter 0: What Even is Money? ──────────────────────────────────
  {
    chapterNumber: 0,
    title: "The Time Traveler's Marketplace",
    description:
      "Travel through time and experience how trade evolved, from bartering goods in an ancient village to using digital payments in modern India. Make choices about how to trade and see how money systems developed.",
    startingWallet: null,
    optimalWalletOutcome: null,
    badgeThreshold: { minScorePercent: 80 },
    startNodeId: "node-0-1",
    nodes: [
      {
        nodeId: "node-0-1",
        narrative:
          "You wake up in an ancient Indian village. You're a rice farmer with 50 kg of surplus rice. You desperately need new tools for the next planting season. The village blacksmith has tools but wants cloth, not rice. The weaver has cloth but wants fish. What do you do?",
        timeSkip: null,
        choices: [
          {
            text: "Make a chain of trades: find a fisherman who wants rice, trade for fish, then trade fish for cloth, then cloth for tools",
            nextNodeId: "node-0-2a",
            walletImpact: 0,
            feedback:
              "Smart! You navigated the 'double coincidence of wants' problem through multiple trades. But notice how exhausting and time-consuming this is, you spent 3 days just trading!",
          },
          {
            text: "Offer the blacksmith double the rice and hope he accepts even though he doesn't want rice",
            nextNodeId: "node-0-2b",
            walletImpact: 0,
            feedback:
              "The blacksmith politely declines, he has no use for rice, regardless of quantity. This is the core problem of barter: if the other person doesn't want what you have, no amount of it will help.",
          },
          {
            text: "Give up on the tools and try farming without them",
            nextNodeId: "node-0-2c",
            walletImpact: 0,
            feedback:
              "Without proper tools, your next harvest will be much smaller. In a barter economy, failing to trade means failing to access essential goods. This is a real problem that money was invented to solve.",
          },
        ],
        isEnd: false,
      },
      {
        nodeId: "node-0-2a",
        narrative:
          "Excellent trading! Now fast forward 2,000 years. You're a merchant in the Maurya Empire. The king has introduced standardized silver punch-marked coins (Karshapana). A trader from a distant kingdom arrives and wants to buy your spices. He offers either 50 cowrie shells or 2 silver Karshapana coins. Both have similar value. Which do you accept?",
        timeSkip: "2,000 years later",
        choices: [
          {
            text: "Accept the silver Karshapana coins, they're standardized, durable, and widely accepted across kingdoms",
            nextNodeId: "node-0-3",
            walletImpact: 0,
            feedback:
              "Excellent choice! Standardized metal coins were a massive leap forward. They were durable, portable, divisible, and had value that was recognized across different kingdoms and cultures.",
          },
          {
            text: "Accept the cowrie shells, they've been used as money for centuries",
            nextNodeId: "node-0-3",
            walletImpact: 0,
            feedback:
              "Cowrie shells did serve as currency, but they were less durable and their value varied widely across regions. As trade expanded, standardized metal coins proved far more practical for large transactions.",
          },
        ],
        isEnd: false,
      },
      {
        nodeId: "node-0-2b",
        narrative:
          "The blacksmith refuses. Another villager suggests that your community adopt cowrie shells as a common medium of exchange, everyone agrees on their value. Do you support this idea?",
        timeSkip: null,
        choices: [
          {
            text: "Yes, a common medium of exchange would solve the trading problems!",
            nextNodeId: "node-0-3",
            walletImpact: 0,
            feedback:
              "You've just witnessed the invention of commodity money! When a community agrees that something (shells, salt, beads) has universally accepted value, trade becomes dramatically easier.",
          },
          {
            text: "No, you prefer to keep bartering directly for what you need",
            nextNodeId: "node-0-end-bad",
            walletImpact: 0,
            feedback:
              "Without accepting a common medium of exchange, you're stuck with the inefficiencies of barter. Most civilizations that refused to adopt money systems fell behind those that did.",
          },
        ],
        isEnd: false,
      },
      {
        nodeId: "node-0-2c",
        narrative:
          "Your harvest suffers. But a traveling sage tells you about communities that use cowrie shells as a medium of exchange. With shells, anyone can buy anything from anyone, no more needing to find someone who wants exactly what you have. Do you adopt this system?",
        timeSkip: "Next harvest season",
        choices: [
          {
            text: "Yes! Sell rice for shells, then use shells to buy tools",
            nextNodeId: "node-0-3",
            walletImpact: 0,
            feedback:
              "Learning from your struggles, you embrace commodity money. Now you can sell your rice to anyone who wants it and use the shells to buy exactly what you need. Trade becomes so much easier!",
          },
          {
            text: "Shells seem silly, stick with direct barter",
            nextNodeId: "node-0-end-bad",
            walletImpact: 0,
            feedback:
              "Unfortunately, stubbornness has a cost. While you struggle to find exact trade matches, merchants using money are thriving and growing their businesses much faster.",
          },
        ],
        isEnd: false,
      },
      {
        nodeId: "node-0-3",
        narrative:
          "Now you're in modern India, 2024. You have a bank account with Rs 50,000, a UPI-enabled phone, and a credit card. Your friend asks you to split a dinner bill of Rs 2,000. How do you pay?",
        timeSkip: "Present day",
        choices: [
          {
            text: "Pay via UPI, instant, free, and the receipt is automatically tracked",
            nextNodeId: "node-0-end-good",
            walletImpact: 0,
            feedback:
              "Perfect! UPI is India's revolutionary digital payment system, it's instant, free for consumers, and creates a digital record. India processes more UPI transactions than most countries process in all digital payment forms combined!",
          },
          {
            text: "Withdraw cash from an ATM and pay in notes",
            nextNodeId: "node-0-end-ok",
            walletImpact: 0,
            feedback:
              "Cash works, but it's less convenient, you need to find an ATM, carry physical money, make exact change, and there's no automatic record. While cash has its place, digital payments are more efficient for everyday transactions.",
          },
          {
            text: "Offer to trade something instead of paying, barter style!",
            nextNodeId: "node-0-end-bad",
            walletImpact: 0,
            feedback:
              "While this is humorous, it shows exactly why barter doesn't work in modern society! Imagine trying to pay rent, buy groceries, and pay your phone bill by bartering goods. We've come a long way from the barter system for very good reasons.",
          },
        ],
        isEnd: false,
      },
      {
        nodeId: "node-0-end-good",
        narrative:
          "Congratulations! You've journeyed through the complete evolution of money, from the frustrations of barter, through commodity money and coins, to the digital payment revolution. You understand why money was invented and how it transformed human civilization. The story of money is really the story of trust, and today, that trust is encoded in digital systems managed by institutions like the RBI.",
        timeSkip: null,
        choices: [],
        isEnd: true,
      },
      {
        nodeId: "node-0-end-ok",
        narrative:
          "You've made it through the evolution of money, though you missed some opportunities along the way. Money evolved from barter to coins to paper to digital, each step making trade easier and more efficient. Understanding this history helps you appreciate the financial tools available to you today.",
        timeSkip: null,
        choices: [],
        isEnd: true,
      },
      {
        nodeId: "node-0-end-bad",
        narrative:
          "Your journey through monetary history hit some rough patches. The key lesson: money was invented to solve real problems with barter, and each evolution (coins, paper, digital) made trade more efficient. Resisting these innovations means falling behind. Understanding money's purpose helps you use modern financial tools more wisely.",
        timeSkip: null,
        choices: [],
        isEnd: true,
      },
    ],
  },

  // ─── Chapter 1: The Stock Market ─────────────────────────────────────
  {
    chapterNumber: 1,
    title: "The IPO Game: Invest or Pass?",
    description:
      "You have Rs 10,000 to invest in the stock market. Navigate through IPOs, market crashes, and company earnings to grow your portfolio. Every decision counts!",
    startingWallet: 10000,
    optimalWalletOutcome: 18000,
    badgeThreshold: { minScorePercent: 85 },
    startNodeId: "node-1-1",
    nodes: [
      {
        nodeId: "node-1-1",
        narrative:
          "Welcome to your first day as a stock market investor! You have Rs 10,000. A hyped food delivery company 'QuickBite' is having its IPO at Rs 500 per share. Social media is buzzing, everyone's applying. The company is growing fast but has never made a profit. What do you do?",
        timeSkip: null,
        choices: [
          {
            text: "Invest Rs 5,000 (10 shares), the hype is real and you don't want to miss out",
            nextNodeId: "node-1-2a",
            walletImpact: -5000,
            feedback:
              "You invested in the IPO. The shares list at Rs 550 (10% gain!), but within a month they drop to Rs 350 as the hype fades and the market realizes the company isn't profitable. Your 10 shares are now worth Rs 3,500, a loss of Rs 1,500.",
          },
          {
            text: "Invest Rs 2,000 (4 shares), small position to test the waters",
            nextNodeId: "node-1-2b",
            walletImpact: -2000,
            feedback:
              "Smart sizing! The shares list at Rs 550 but drop to Rs 350 within a month. Your 4 shares are now worth Rs 1,400, a Rs 600 loss, but manageable because you didn't overcommit.",
          },
          {
            text: "Skip the IPO, invest in a Nifty 50 index fund instead",
            nextNodeId: "node-1-2c",
            walletImpact: -5000,
            feedback:
              "Wise move! While everyone chases the IPO, you quietly invest Rs 5,000 in a Nifty 50 index fund. Over the next month, the market rises 3% and your investment grows to Rs 5,150. Meanwhile, QuickBite shares crashed 30% post-listing.",
          },
        ],
        isEnd: false,
      },
      {
        nodeId: "node-1-2a",
        narrative:
          "Three months later. QuickBite is trading at Rs 350 (you're down Rs 1,500). But a solid IT company 'TechCore' has great quarterly results, profits up 25%, stock at Rs 800. Meanwhile, the overall market just dropped 5% due to global tensions. You have Rs 5,000 cash remaining. What's your move?",
        timeSkip: "3 months later",
        choices: [
          {
            text: "Sell QuickBite at a loss and buy TechCore shares, cut your losses and move to quality",
            nextNodeId: "node-1-3",
            walletImpact: -1500,
            feedback:
              "Cutting losses early is a sign of a mature investor. You sell QuickBite for Rs 3,500 (loss of Rs 1,500) and now have Rs 8,500 cash. TechCore at Rs 800 is a quality buy after good results.",
          },
          {
            text: "Hold QuickBite, it'll bounce back eventually, and buy TechCore with your remaining cash",
            nextNodeId: "node-1-3",
            walletImpact: 0,
            feedback:
              "Holding a loss-making company hoping it will 'bounce back' is a common mistake driven by loss aversion. QuickBite may never recover. But at least you're diversifying by adding TechCore.",
          },
          {
            text: "Buy more QuickBite to 'average down' your cost",
            nextNodeId: "node-1-3-bad",
            walletImpact: -2000,
            feedback:
              "Averaging down on a fundamentally weak stock is dangerous. You're throwing good money after bad. 'Averaging down' only makes sense if the company's fundamentals are strong and the drop is temporary.",
          },
        ],
        isEnd: false,
      },
      {
        nodeId: "node-1-2b",
        narrative:
          "Three months later. QuickBite is at Rs 350 (small loss). A reliable IT company 'TechCore' reported 25% profit growth, stock at Rs 800. The market recently dipped 5%. You have Rs 8,000 in cash. What do you do?",
        timeSkip: "3 months later",
        choices: [
          {
            text: "Sell QuickBite, invest in TechCore and a Nifty index fund, diversify properly",
            nextNodeId: "node-1-3",
            walletImpact: -600,
            feedback:
              "Excellent! You took a small loss on QuickBite (Rs 600), learned the lesson about hype-driven investing, and moved into quality investments. Diversifying between individual stocks and index funds is textbook smart investing.",
          },
          {
            text: "Keep QuickBite and use cash to buy TechCore, build a portfolio",
            nextNodeId: "node-1-3",
            walletImpact: 0,
            feedback:
              "Building a portfolio is good, but holding a loss-making company out of hope isn't ideal. The good news is your position in QuickBite is small, so the damage is limited.",
          },
        ],
        isEnd: false,
      },
      {
        nodeId: "node-1-2c",
        narrative:
          "Three months later. Your Nifty index fund is up 3% to Rs 5,150. QuickBite shares (which you skipped) crashed from Rs 500 to Rs 350. Now 'TechCore', a profitable IT company, reported great results. Stock is at Rs 800. The market dipped 5% on global news. What do you do?",
        timeSkip: "3 months later",
        choices: [
          {
            text: "Buy TechCore shares, a dip in a quality stock is a buying opportunity",
            nextNodeId: "node-1-3",
            walletImpact: -4000,
            feedback:
              "Buying quality stocks during market dips is a time-tested strategy. 'Be fearful when others are greedy, be greedy when others are fearful.' TechCore has strong fundamentals and you're getting it at a relative discount.",
          },
          {
            text: "Add more to your index fund, stick with diversification",
            nextNodeId: "node-1-3",
            walletImpact: -3000,
            feedback:
              "Consistent investing in an index fund, especially during dips, is one of the most reliable wealth-building strategies. You're buying more units at a lower price, which amplifies your returns when the market recovers.",
          },
        ],
        isEnd: false,
      },
      {
        nodeId: "node-1-3",
        narrative:
          "One year has passed. TechCore stock rose 30% to Rs 1,040. The Nifty 50 is up 15% for the year. Your portfolio has grown nicely. A friend shares a 'hot tip' about a penny stock that could '10x in a month'. Meanwhile, you could also start a monthly SIP of Rs 1,000 in a mutual fund. What's your final move?",
        timeSkip: "9 months later",
        choices: [
          {
            text: "Start the SIP and ignore the hot tip, systematic investing beats speculation",
            nextNodeId: "node-1-end-good",
            walletImpact: 3000,
            feedback:
              "Outstanding! SIPs build wealth through discipline and rupee cost averaging. The penny stock 'hot tip' crashed 80% within weeks. Your portfolio has grown through quality investments and disciplined approach.",
          },
          {
            text: "Put some in the penny stock and some in SIP, diversify opportunities",
            nextNodeId: "node-1-end-ok",
            walletImpact: 1000,
            feedback:
              "The penny stock crashed 80%, wiping out most of that bet. But your SIP portion is doing well. The lesson: tips and speculation are not 'diversification', they're gambling. Stick with what works.",
          },
          {
            text: "Go all-in on the penny stock, this could be your big break",
            nextNodeId: "node-1-end-bad",
            walletImpact: -4000,
            feedback:
              "The penny stock crashed 80% within weeks. 'Hot tips' are almost always a way to lose money. The promoters already bought in at low prices and need people like you to push the price up so they can sell.",
          },
        ],
        isEnd: false,
      },
      {
        nodeId: "node-1-3-bad",
        narrative:
          "One year later. QuickBite is now at Rs 200, your 'averaging down' strategy has made things worse. You've lost significant money on a company that keeps burning cash. A friend suggests cutting all losses and starting fresh with index funds. What do you do?",
        timeSkip: "9 months later",
        choices: [
          {
            text: "Accept the loss, sell everything, and start a SIP in an index fund",
            nextNodeId: "node-1-end-ok",
            walletImpact: -2000,
            feedback:
              "Better late than never. Accepting losses and moving to a sound strategy takes courage. The money lost is a 'tuition fee' for a valuable lesson about not chasing hype or averaging down on weak stocks.",
          },
          {
            text: "Hold QuickBite hoping for a miracle recovery",
            nextNodeId: "node-1-end-bad",
            walletImpact: -3000,
            feedback:
              "QuickBite eventually delisted from the exchange after running out of money. Your entire investment in it became worthless. The hardest lesson in investing: knowing when to cut your losses.",
          },
        ],
        isEnd: false,
      },
      {
        nodeId: "node-1-end-good",
        narrative:
          "After one year, your portfolio stands strong! You skipped the hype, invested in quality, and started disciplined SIPs. Your final portfolio value is approximately Rs 18,000, an 80% return. More importantly, you've built investing habits that will compound for decades. You've earned the Market Guru badge!",
        timeSkip: null,
        choices: [],
        isEnd: true,
      },
      {
        nodeId: "node-1-end-ok",
        narrative:
          "Your first year in the market had ups and downs. You made some good calls and some not-so-good ones. Your portfolio is roughly Rs 12,000-14,000. The key takeaway: avoid hype-driven investments, focus on quality, and let systematic investing do the heavy lifting. You're on the right track!",
        timeSkip: null,
        choices: [],
        isEnd: true,
      },
      {
        nodeId: "node-1-end-bad",
        narrative:
          "Your first year was tough, chasing hype, following tips, and refusing to cut losses. Your portfolio has shrunk significantly. But every great investor has stories of early mistakes. The key is to learn: invest in what you understand, diversify, think long-term, and never follow 'hot tips'.",
        timeSkip: null,
        choices: [],
        isEnd: true,
      },
    ],
  },

  // ─── Chapter 2: Investing 101 ────────────────────────────────────────
  {
    chapterNumber: 2,
    title: "The 20-Year Wealth Builder",
    description:
      "You're 22 years old with Rs 5,000 to start investing. Make decisions over 20 simulated years, choosing between FDs, mutual funds, SIPs, and more. Watch compound interest work its magic (or not).",
    startingWallet: 5000,
    optimalWalletOutcome: 45000,
    badgeThreshold: { minScorePercent: 80 },
    startNodeId: "node-2-1",
    nodes: [
      {
        nodeId: "node-2-1",
        narrative:
          "You just got your first salary, Rs 30,000/month. After expenses, you can save Rs 5,000 per month. Your parents insist on a Fixed Deposit. Your colleague recommends a Nifty 50 index fund SIP. Your friend says crypto is the future. Where do you put your Rs 5,000/month?",
        timeSkip: null,
        choices: [
          {
            text: "Fixed Deposit at 6.5% annual interest, safe and guaranteed",
            nextNodeId: "node-2-2a",
            walletImpact: 0,
            feedback:
              "FDs are safe but at 6.5% with inflation at 6%, your real return is only 0.5% per year. Over 20 years, safety comes at the cost of significant wealth creation.",
          },
          {
            text: "Nifty 50 index fund SIP, diversified equity exposure with low fees",
            nextNodeId: "node-2-2b",
            walletImpact: 2000,
            feedback:
              "Smart choice! Index funds give you diversified exposure to India's top 50 companies with very low fees (0.1-0.2%). Historically, Nifty has returned ~12% annually over 10+ year periods.",
          },
          {
            text: "Put it all in Bitcoin, crypto is the future",
            nextNodeId: "node-2-2c",
            walletImpact: -1000,
            feedback:
              "Crypto is highly volatile and speculative. In the first year, Bitcoin dropped 40%. With no diversification and extreme volatility, this is gambling, not investing.",
          },
        ],
        isEnd: false,
      },
      {
        nodeId: "node-2-2a",
        narrative:
          "Five years later. Your FD has grown steadily to Rs 3,40,000 (Rs 5,000/month x 60 months + 6.5% compounding). Safe, but inflation has been 6%, your real purchasing power grew by barely anything. Meanwhile, your colleague's index fund SIP grew to Rs 4,10,000 (12% returns). A financial advisor suggests you diversify. What do you do?",
        timeSkip: "5 years later",
        choices: [
          {
            text: "Move future SIPs to a balanced mix, 60% equity mutual fund, 40% FD",
            nextNodeId: "node-2-3",
            walletImpact: 3000,
            feedback:
              "A balanced approach! You keep some safety with FDs while also participating in equity growth. This is a reasonable strategy for someone who wants moderate growth with controlled risk.",
          },
          {
            text: "Stay with FDs, the stock market is too risky",
            nextNodeId: "node-2-3-conservative",
            walletImpact: 0,
            feedback:
              "Playing it too safe has its own risk, inflation risk. Over 20 years, FD returns barely beat inflation, meaning your wealth grows very slowly in real terms.",
          },
        ],
        isEnd: false,
      },
      {
        nodeId: "node-2-2b",
        narrative:
          "Five years later. Your SIP has grown to Rs 4,10,000 despite a 30% market crash in year 3 (you kept investing through it!). The crash was scary, but your SIP bought more units at lower prices, boosting your returns when the market recovered. Now your salary has increased. You can save Rs 10,000/month. How do you allocate?",
        timeSkip: "5 years later",
        choices: [
          {
            text: "Rs 7,000 in equity SIP + Rs 3,000 in a debt fund for stability",
            nextNodeId: "node-2-3",
            walletImpact: 5000,
            feedback:
              "Excellent asset allocation! As your wealth grows, adding a debt component provides stability. The 70/30 equity/debt split is age-appropriate for someone in their late 20s with a long investment horizon.",
          },
          {
            text: "Put all Rs 10,000 in the equity SIP, maximize growth",
            nextNodeId: "node-2-3",
            walletImpact: 4000,
            feedback:
              "Aggressive but not unreasonable at your age. The long time horizon (15+ years remaining) can absorb equity volatility. Just remember to rebalance as you get older and closer to your goals.",
          },
        ],
        isEnd: false,
      },
      {
        nodeId: "node-2-2c",
        narrative:
          "Five years later. Bitcoin went on a rollercoaster, up 300%, then down 70%, then up again, then down. Your portfolio value fluctuated wildly. Currently you have Rs 2,80,000, less than if you'd simply put the money in an FD. Your financial advisor says it's not too late to pivot. What do you do?",
        timeSkip: "5 years later",
        choices: [
          {
            text: "Move to a diversified portfolio, SIP in index fund + small crypto allocation (10%)",
            nextNodeId: "node-2-3",
            walletImpact: 2000,
            feedback:
              "Learning from experience! A small crypto allocation (5-10%) is reasonable speculation, but the core of your portfolio should be in diversified equity and debt instruments. You've lost time, but not all is lost.",
          },
          {
            text: "Double down on crypto, the next bull run will make up for everything",
            nextNodeId: "node-2-end-bad",
            walletImpact: -5000,
            feedback:
              "Hoping for a recovery by doubling down is a classic gambler's fallacy. Crypto went through another extended bear market, and without diversification, your portfolio suffered even more.",
          },
        ],
        isEnd: false,
      },
      {
        nodeId: "node-2-3",
        narrative:
          "Twenty years from when you started. Through disciplined investing, market crashes (you kept investing!), and the magic of compounding, your portfolio has grown significantly. One final decision: you're offered a chance to withdraw everything for a luxury car, or let it compound for 5 more years. What do you choose?",
        timeSkip: "15 years later",
        choices: [
          {
            text: "Let it compound 5 more years, the last few years of compounding are the most powerful",
            nextNodeId: "node-2-end-good",
            walletImpact: 15000,
            feedback:
              "The final years of compounding produce the biggest absolute gains because you're earning returns on the largest base. This patience is what separates wealthy investors from everyone else.",
          },
          {
            text: "Withdraw for the car, you've been patient enough",
            nextNodeId: "node-2-end-ok",
            walletImpact: 0,
            feedback:
              "You've done well to invest for 20 years, but remember: the last 5 years of a 25-year compounding journey often produce more wealth than the first 15 combined. That luxury car will depreciate while your investments would have kept growing.",
          },
        ],
        isEnd: false,
      },
      {
        nodeId: "node-2-3-conservative",
        narrative:
          "Twenty years later. Your FDs have accumulated to a decent amount, but adjusted for inflation, your real wealth growth has been minimal. Your colleague who invested in equity funds has roughly 3x more wealth than you. What's your reflection?",
        timeSkip: "15 years later",
        choices: [
          {
            text: "Start equity SIPs now, better late than never",
            nextNodeId: "node-2-end-ok",
            walletImpact: 2000,
            feedback:
              "It IS better late than never, but you've lost the most powerful years of compounding. At 42, you have less time for equity to work its magic. The lesson: start equity investing early when time is on your side.",
          },
          {
            text: "Continue with FDs, at least the money is safe",
            nextNodeId: "node-2-end-conservative",
            walletImpact: 0,
            feedback:
              "Your money is 'safe' from market volatility but not from inflation. In 20 years, your FD returns barely kept up with rising prices. Safety is important, but over-prioritizing it has a real cost over long time horizons.",
          },
        ],
        isEnd: false,
      },
      {
        nodeId: "node-2-end-good",
        narrative:
          "Congratulations! Through disciplined SIP investing, smart asset allocation, and the power of compounding over 25 years, your portfolio has grown to approximately Rs 45,000+ in simulation value (representing a multi-crore real portfolio). You invested through crashes, ignored hot tips, and let time do the work. You truly understand the magic of compound interest!",
        timeSkip: null,
        choices: [],
        isEnd: true,
      },
      {
        nodeId: "node-2-end-ok",
        narrative:
          "You've done reasonably well, better than most Indians who don't invest at all. Your portfolio is healthy, but there were opportunities for more growth that you missed. The key lesson: start early, invest consistently, diversify wisely, and let compounding work. Even small improvements in strategy compound into huge differences over decades.",
        timeSkip: null,
        choices: [],
        isEnd: true,
      },
      {
        nodeId: "node-2-end-bad",
        narrative:
          "Unfortunately, concentrated bets and lack of diversification took a heavy toll. The good news? You're still young enough to learn and recover. The critical lessons: diversify always, invest in what you understand, and never gamble with your core savings. Even the best investors make mistakes, what matters is learning from them.",
        timeSkip: null,
        choices: [],
        isEnd: true,
      },
      {
        nodeId: "node-2-end-conservative",
        narrative:
          "Your money is safe, but 20 years of below-inflation returns means you haven't built real wealth. While equity investors dealt with volatility, their wealth grew 3-4x more. For young investors with a long horizon, some calculated risk is actually safer than no risk, because inflation is guaranteed. The biggest risk is not taking any.",
        timeSkip: null,
        choices: [],
        isEnd: true,
      },
    ],
  },

  // ─── Chapter 3: Your Money Psychology ────────────────────────────────
  {
    chapterNumber: 3,
    title: "The Bias Gauntlet",
    description:
      "Navigate a day full of financial decisions, each designed to test a different psychological bias. Can you spot the traps your own brain sets for you?",
    startingWallet: 3000,
    optimalWalletOutcome: 4500,
    badgeThreshold: { minScorePercent: 80 },
    startNodeId: "node-3-1",
    nodes: [
      {
        nodeId: "node-3-1",
        narrative:
          "Morning. You open Instagram and see three friends showing off new sneakers (Rs 8,000 each). You have comfortable shoes that work fine. A sale notification pops up: 'Original price Rs 8,000, NOW Rs 4,500! Only 3 left!' Your budget for discretionary spending this month is Rs 3,000. What do you do?",
        timeSkip: null,
        choices: [
          {
            text: "Buy them! Rs 4,500 is a steal compared to Rs 8,000, and everyone has them",
            nextNodeId: "node-3-2",
            walletImpact: -1500,
            feedback:
              "You fell for THREE biases at once! Anchoring (Rs 8,000 makes Rs 4,500 seem cheap), herd mentality (friends have them), and scarcity ('Only 3 left!'). You also exceeded your Rs 3,000 discretionary budget. The shoes cost Rs 4,500 but were only 'worth' Rs 3,000 to you before the biases kicked in.",
          },
          {
            text: "Use the 24-hour rule, close the app and decide tomorrow",
            nextNodeId: "node-3-2",
            walletImpact: 500,
            feedback:
              "Excellent self-awareness! The 24-hour rule neutralizes urgency bias and scarcity pressure. By tomorrow, the FOMO will have faded and you can evaluate the purchase rationally. Most impulse purchases feel unnecessary after a cooling period.",
          },
          {
            text: "Check if the shoes are actually worth Rs 4,500 by comparing prices across other sites",
            nextNodeId: "node-3-2",
            walletImpact: 300,
            feedback:
              "Smart! You defused the anchoring bias by seeking the real market price. Often, the 'original price' is inflated to make the discount seem larger. Comparison shopping reveals the true value.",
          },
        ],
        isEnd: false,
      },
      {
        nodeId: "node-3-2",
        narrative:
          "Afternoon. You invested Rs 10,000 in a stock 3 months ago. It's now worth Rs 7,000 (down 30%). The company's fundamentals haven't changed, it's still a solid business. Meanwhile, another stock you bought at Rs 5,000 is now worth Rs 7,500 (up 50%). A friend says 'Book your profits before they disappear!' What do you do?",
        timeSkip: "Later that day",
        choices: [
          {
            text: "Sell the winning stock to 'lock in profits' and hold the losing stock hoping it'll recover",
            nextNodeId: "node-3-3",
            walletImpact: -500,
            feedback:
              "This is the 'disposition effect', selling winners too early and holding losers too long. Loss aversion makes you avoid 'realizing' the loss. But rationally, you should evaluate each stock on its current merits, not on what you paid for it.",
          },
          {
            text: "Evaluate both stocks on current fundamentals, regardless of your purchase price",
            nextNodeId: "node-3-3",
            walletImpact: 500,
            feedback:
              "Perfect! Your purchase price is a 'sunk cost', it shouldn't affect future decisions. What matters is: which stock has better prospects going forward? By evaluating on fundamentals, you avoid the disposition effect and loss aversion.",
          },
          {
            text: "Sell both and put everything in an FD, the stock market is too stressful",
            nextNodeId: "node-3-3",
            walletImpact: -300,
            feedback:
              "This is an emotional reaction driven by loss aversion and stress. Exiting the market entirely because of short-term losses means you'll also miss the long-term gains. Markets recover, your emotions might not let you re-enter at the right time.",
          },
        ],
        isEnd: false,
      },
      {
        nodeId: "node-3-3",
        narrative:
          "Evening. You're at a restaurant with friends. The menu has three options: Basic Thali (Rs 200), Premium Thali (Rs 500), and Royal Thali (Rs 1,200). Most people in your group order the Premium Thali. You were planning to spend Rs 200 on dinner tonight. What do you order?",
        timeSkip: "That evening",
        choices: [
          {
            text: "Premium Thali, it's the 'middle option' and that's what everyone's getting",
            nextNodeId: "node-3-end-ok",
            walletImpact: -300,
            feedback:
              "Two biases! The 'decoy effect', the Rs 1,200 Royal Thali exists to make Rs 500 seem reasonable. And 'social proof', you ordered what the group ordered. The Rs 200 Basic Thali was your original plan and probably would have satisfied you just fine.",
          },
          {
            text: "Basic Thali, stick with your original plan and budget",
            nextNodeId: "node-3-end-good",
            walletImpact: 500,
            feedback:
              "Strong discipline! You recognized the decoy effect (Royal Thali making Premium seem reasonable) and social proof (group pressure) and stuck with your plan. This is what conscious spending looks like, choosing based on your values, not social pressure.",
          },
          {
            text: "Royal Thali, you only live once, treat yourself!",
            nextNodeId: "node-3-end-bad",
            walletImpact: -1000,
            feedback:
              "'YOLO' spending is present bias in action, prioritizing immediate pleasure over future financial health. The Royal Thali costs 6x your planned spend. Occasional treats are fine, but this wasn't a planned treat, it was an impulse driven by the menu design and social setting.",
          },
        ],
        isEnd: false,
      },
      {
        nodeId: "node-3-end-good",
        narrative:
          "Incredible self-awareness! Throughout the day, you recognized anchoring bias, scarcity urgency, herd mentality, loss aversion, the disposition effect, the decoy effect, and social proof. You made decisions based on your actual needs and values, not psychological tricks. You're well on your way to mastering your money psychology!",
        timeSkip: null,
        choices: [],
        isEnd: true,
      },
      {
        nodeId: "node-3-end-ok",
        narrative:
          "You caught some biases but fell for others, which is completely normal! The human brain isn't wired for rational financial decisions. The key is building awareness over time. Now that you can name these biases (anchoring, loss aversion, social proof, scarcity), you'll start noticing them everywhere, and that awareness is your defense.",
        timeSkip: null,
        choices: [],
        isEnd: true,
      },
      {
        nodeId: "node-3-end-bad",
        narrative:
          "Your brain's biases had a field day! But don't feel bad, most people fall for these tricks without even realizing it. Marketers and product designers spend billions exploiting these exact psychological patterns. The fact that you've now learned about anchoring, loss aversion, herd mentality, and the decoy effect means you'll start catching yourself next time.",
        timeSkip: null,
        choices: [],
        isEnd: true,
      },
    ],
  },

  // ─── Chapter 4: Managing Your Money ──────────────────────────────────
  {
    chapterNumber: 4,
    title: "The Budget Challenge: One Month to Financial Control",
    description:
      "Manage a monthly salary of Rs 30,000 for one full month. Allocate between needs, wants, savings, and handle unexpected expenses that pop up. Can you end the month in the green?",
    startingWallet: 30000,
    optimalWalletOutcome: 36000,
    badgeThreshold: { minScorePercent: 80 },
    startNodeId: "node-4-1",
    nodes: [
      {
        nodeId: "node-4-1",
        narrative:
          "Payday! Rs 30,000 just hit your account. Before spending anything, you need to set a budget. How do you allocate your salary using the 50/30/20 approach?",
        timeSkip: null,
        choices: [
          {
            text: "Auto-transfer Rs 6,000 (20%) to a savings/investment account FIRST, then plan the rest",
            nextNodeId: "node-4-2",
            walletImpact: 6000,
            feedback:
              "Textbook 'pay yourself first'! By saving before spending, you guarantee your savings target is met. The remaining Rs 24,000 is for needs (Rs 15,000) and wants (Rs 9,000). This approach works because you adjust your spending to fit what's left, not the other way around.",
          },
          {
            text: "Plan to spend on needs and wants first, then save whatever is left at month-end",
            nextNodeId: "node-4-2",
            walletImpact: 2000,
            feedback:
              "This is how most people budget, and why most people struggle to save. When you save 'whatever is left', there's usually nothing left. Expenses expand to fill available money (Parkinson's Law applied to finances). You'll likely save less than Rs 6,000.",
          },
          {
            text: "No budget needed, just be careful with spending and it'll work out",
            nextNodeId: "node-4-2",
            walletImpact: -1000,
            feedback:
              "Without a plan, money disappears fast. Studies show that people who budget consistently save 2-3x more than those who don't. 'Being careful' is vague, a budget gives you specific guardrails.",
          },
        ],
        isEnd: false,
      },
      {
        nodeId: "node-4-2",
        narrative:
          "Week 2. You've paid rent (Rs 8,000), groceries (Rs 4,000), and transport (Rs 2,000). But surprise, your laptop charger breaks (Rs 1,500) and a friend's birthday party costs more than expected (Rs 2,500 on dinner + gift). These unplanned expenses are eating into your budget. What do you do?",
        timeSkip: "2 weeks later",
        choices: [
          {
            text: "Cover the charger from needs (it's essential) and reduce remaining wants budget to compensate for the party overspend",
            nextNodeId: "node-4-3",
            walletImpact: 2000,
            feedback:
              "Smart budgeting! The charger is a genuine need, so it comes from that category. The party overspend is a want, so you cut back on other wants this month to balance. This is how flexible budgeting works: categories can flex, but the total shouldn't change.",
          },
          {
            text: "Dip into your savings to cover both, you can make up for it next month",
            nextNodeId: "node-4-3",
            walletImpact: -2000,
            feedback:
              "Raiding savings for regular expenses is a slippery slope. 'I'll make up for it next month' rarely happens, next month has its own surprises. This is exactly why savings should be in a separate account that's harder to access.",
          },
          {
            text: "Use your credit card for both and deal with it later",
            nextNodeId: "node-4-3",
            walletImpact: -3000,
            feedback:
              "Putting unplanned expenses on credit without a repayment plan is how credit card debt starts. If you can't pay the full bill next month, you'll pay 36% annual interest. The Rs 4,000 of expenses could end up costing Rs 5,500+ over time.",
          },
        ],
        isEnd: false,
      },
      {
        nodeId: "node-4-3",
        narrative:
          "Week 4, almost month-end. You have a decision to make. A major sale is happening online with 'up to 70% off' on electronics and clothes. You've been eyeing a pair of headphones (Rs 3,000 on sale, usually Rs 5,000). Your wants budget is nearly used up. Also, your car's insurance renewal is due next month (Rs 8,000). What's your priority?",
        timeSkip: "2 weeks later",
        choices: [
          {
            text: "Skip the sale, start setting aside money for the insurance renewal, it's a known upcoming expense",
            nextNodeId: "node-4-end-good",
            walletImpact: 4000,
            feedback:
              "Financial maturity! Anticipating future expenses and saving for them in advance prevents budget emergencies. The sale will come again, there's always another sale. But insurance is mandatory and non-negotiable.",
          },
          {
            text: "Buy the headphones, it's 40% off and this deal won't last",
            nextNodeId: "node-4-end-ok",
            walletImpact: -1000,
            feedback:
              "The scarcity bias ('won't last') pushed you into spending on a want when you have a known major expense coming. The headphones work fine, but now you're Rs 3,000 closer to a budget crunch next month when insurance is due.",
          },
          {
            text: "Buy the headphones AND some clothes from the sale, you deserve a treat after a tough month",
            nextNodeId: "node-4-end-bad",
            walletImpact: -4000,
            feedback:
              "Emotional spending ('I deserve it') combined with sale psychology just blew your budget. With insurance due next month and savings depleted, you're setting up a cycle of month-to-month financial stress.",
          },
        ],
        isEnd: false,
      },
      {
        nodeId: "node-4-end-good",
        narrative:
          "Month-end summary: You paid yourself first, handled unexpected expenses without touching savings, adjusted your wants budget when needed, and planned ahead for next month's big expense. You end the month with savings intact and no debt. This is what winning at personal finance looks like, not deprivation, but intentional choices.",
        timeSkip: null,
        choices: [],
        isEnd: true,
      },
      {
        nodeId: "node-4-end-ok",
        narrative:
          "Month-end: You managed okay but some impulse decisions and reactive budgeting mean your savings took a hit. The good news? You stayed mostly on track and learned valuable lessons about budgeting flexibility. Next month, try automating your savings first and anticipating known expenses in advance.",
        timeSkip: null,
        choices: [],
        isEnd: true,
      },
      {
        nodeId: "node-4-end-bad",
        narrative:
          "Tough month. Between unplanned spending, emotional purchases, and no forward planning, you ended up dipping into savings and possibly carrying credit card debt. But every month is a fresh start. The biggest lesson: a budget isn't about restriction, it's about making sure your money aligns with your actual priorities.",
        timeSkip: null,
        choices: [],
        isEnd: true,
      },
    ],
  },

  // ─── Chapter 5: Credit & Debt ────────────────────────────────────────
  {
    chapterNumber: 5,
    title: "The Debt Escape Room",
    description:
      "You're managing Rs 40,000 in income while juggling credit card bills, loan EMIs, and the temptation of easy credit. Make smart decisions to stay debt-free, or spiral into a debt trap.",
    startingWallet: 40000,
    optimalWalletOutcome: 48000,
    badgeThreshold: { minScorePercent: 85 },
    startNodeId: "node-5-1",
    nodes: [
      {
        nodeId: "node-5-1",
        narrative:
          "You earn Rs 40,000/month. Your credit card bill this month is Rs 15,000. The minimum payment is Rs 750 (5%). Your bank account has Rs 40,000 after salary. You also need Rs 20,000 for rent and Rs 8,000 for other essentials. That leaves Rs 12,000 for the credit card bill. How do you handle it?",
        timeSkip: null,
        choices: [
          {
            text: "Pay the full Rs 15,000, cut Rs 3,000 from wants to make up the difference",
            nextNodeId: "node-5-2",
            walletImpact: 5000,
            feedback:
              "Smart! Paying the full credit card bill means zero interest charges. Cutting Rs 3,000 from wants is temporary pain, but at 36% interest, carrying that Rs 3,000 balance would have cost you Rs 90+ per month in interest, growing every month.",
          },
          {
            text: "Pay Rs 12,000 (what's comfortable) and carry the Rs 3,000 balance",
            nextNodeId: "node-5-2",
            walletImpact: 0,
            feedback:
              "You'll pay 36% annual interest on the Rs 3,000 balance, that's Rs 90 per month just in interest. And here's the catch: once you don't pay in full, you lose the interest-free period on ALL new purchases too. The debt snowball has started.",
          },
          {
            text: "Pay only the minimum Rs 750, keep cash for other things",
            nextNodeId: "node-5-2-bad",
            walletImpact: -3000,
            feedback:
              "Danger zone! You now owe Rs 14,250 at 36% annual interest. Next month, you'll owe Rs 14,250 + interest + new purchases. This is exactly how credit card debt spirals, the minimum payment barely covers interest, so the principal keeps growing.",
          },
        ],
        isEnd: false,
      },
      {
        nodeId: "node-5-2",
        narrative:
          "Three months later. Your employer offers you a company phone (free!) but you spot a shiny new iPhone for Rs 1,20,000. The store offers 'no-cost EMI' over 24 months (Rs 5,000/month). A friend says 'It's no-cost, basically free money!' Meanwhile, you have no emergency fund yet. What do you do?",
        timeSkip: "3 months later",
        choices: [
          {
            text: "Take the company phone and start building your emergency fund with the Rs 5,000/month you'd have spent on EMIs",
            nextNodeId: "node-5-3",
            walletImpact: 5000,
            feedback:
              "Outstanding decision! A free phone is a free phone. Using that Rs 5,000/month to build an emergency fund means you'll have Rs 30,000 saved in 6 months. That emergency fund will prevent you from ever needing to take debt for unexpected expenses.",
          },
          {
            text: "Take the no-cost EMI iPhone, it's zero interest, so why not?",
            nextNodeId: "node-5-3",
            walletImpact: -2000,
            feedback:
              "The 'no-cost' EMI likely has a processing fee (Rs 2,000-3,000) baked in. More importantly, you've committed Rs 5,000/month for 2 years when you have no emergency fund. If any unexpected expense hits, you'll have both EMI obligations AND a new debt to manage.",
          },
        ],
        isEnd: false,
      },
      {
        nodeId: "node-5-2-bad",
        narrative:
          "Three months later. Your credit card debt has ballooned to Rs 45,000 at 36% annual interest. Minimum payments barely cover the interest. A 'debt consolidation loan' company offers to pay off your credit card at 18% interest over 3 years. Meanwhile, your friend suggests extreme budgeting to pay it off in 6 months. What do you choose?",
        timeSkip: "3 months later",
        choices: [
          {
            text: "Extreme budgeting, cut all non-essentials and pay Rs 8,000/month to clear the debt in ~6 months",
            nextNodeId: "node-5-3",
            walletImpact: 2000,
            feedback:
              "The fastest and cheapest way out of credit card debt is aggressive repayment. 6 months of discipline to clear Rs 45,000+ interest is much better than a 3-year loan. And the habits you build will prevent this from happening again.",
          },
          {
            text: "Take the consolidation loan, at least 18% is better than 36%",
            nextNodeId: "node-5-3",
            walletImpact: -1000,
            feedback:
              "While 18% is better than 36%, a 3-year loan means you'll pay about Rs 12,000 in total interest. More importantly, if you don't fix the spending habits that created the debt, you'll end up with BOTH the loan AND new credit card debt.",
          },
        ],
        isEnd: false,
      },
      {
        nodeId: "node-5-3",
        narrative:
          "One year later. A bank pre-approves you for a personal loan of Rs 5,00,000 at 14% interest. They call it an 'exclusive offer, limited time!' You don't need the money for anything specific, but having Rs 5 lakh available feels nice. Also, your CIBIL score has improved to 750. What do you decide?",
        timeSkip: "1 year later",
        choices: [
          {
            text: "Decline, never take debt you don't need, regardless of how 'good' the offer sounds",
            nextNodeId: "node-5-end-good",
            walletImpact: 5000,
            feedback:
              "Perfectly disciplined! Taking a loan you don't need means paying interest for money sitting idle. Banks push these offers because they profit from the interest. Your CIBIL score of 750 means you can get a loan WHEN you actually need one, not before.",
          },
          {
            text: "Take it and invest the money, if investments return more than 14%, you profit",
            nextNodeId: "node-5-end-ok",
            walletImpact: -2000,
            feedback:
              "This is called 'leveraged investing' and it's risky. If your investments return less than 14% (or lose value), you're paying interest on money that's shrinking. The loan EMI is guaranteed debt; investment returns are not guaranteed. This strategy has destroyed many portfolios.",
          },
          {
            text: "Take it, use some for a vacation and keep the rest as a buffer",
            nextNodeId: "node-5-end-bad",
            walletImpact: -5000,
            feedback:
              "Borrowing at 14% for a vacation is expensive leisure. A Rs 1,00,000 vacation becomes Rs 1,20,000+ after interest. And that 'buffer' sitting in your savings account at 4% while you pay 14% on the loan means you're losing 10% per year. This is classic bad debt.",
          },
        ],
        isEnd: false,
      },
      {
        nodeId: "node-5-end-good",
        narrative:
          "Outstanding! You navigated credit cards wisely, avoided unnecessary debt, prioritized your emergency fund over lifestyle inflation, and resisted the allure of 'free money' offers. Your credit score is excellent, you're debt-free, and you have savings growing. You understand that the best use of credit is never needing to use it. Debt Dodger badge earned!",
        timeSkip: null,
        choices: [],
        isEnd: true,
      },
      {
        nodeId: "node-5-end-ok",
        narrative:
          "You've made some decent decisions and some risky ones. You understand credit basics but got tempted by leveraged investing or 'good deals' on debt. The key insight: debt should be a tool used rarely and strategically (education, home), not for lifestyle or speculation. Keep building those money management muscles!",
        timeSkip: null,
        choices: [],
        isEnd: true,
      },
      {
        nodeId: "node-5-end-bad",
        narrative:
          "Credit and debt got the better of you this round. Between carrying credit card balances, unnecessary loans, and lifestyle debt, a significant portion of your income goes to interest payments. But now you know the traps: minimum payments, 'no-cost' EMIs, pre-approved loan offers, and borrowing for wants. Use this knowledge to break the cycle.",
        timeSkip: null,
        choices: [],
        isEnd: true,
      },
    ],
  },

  // ─── Chapter 6: The Shield - Fraud Protection ───────────────────────
  {
    chapterNumber: 6,
    title: "Scam City: Can You Survive Without Losing a Rupee?",
    description:
      "Navigate through a day packed with increasingly sophisticated financial scams, from UPI fraud to phishing attacks to Ponzi schemes. Every wrong choice costs you. Can you emerge unscathed?",
    startingWallet: null,
    optimalWalletOutcome: null,
    badgeThreshold: { minScorePercent: 90 },
    startNodeId: "node-6-1",
    nodes: [
      {
        nodeId: "node-6-1",
        narrative:
          "Morning. You receive an SMS: 'SBI Alert: Your account has been temporarily blocked due to KYC expiry. Update now to avoid permanent closure: http://sbi-kyc-verify.co.in/update. Valid for 24 hours only.' The message looks official with the SBI logo. What do you do?",
        timeSkip: null,
        choices: [
          {
            text: "Click the link quickly, you don't want your account blocked!",
            nextNodeId: "node-6-2",
            walletImpact: 0,
            feedback:
              "SCAM! That link leads to a fake website that looks exactly like SBI's site. If you entered your credentials, scammers now have your username and password. Red flags you missed: SMS links (banks use their official app), urgency ('24 hours'), and the suspicious domain (sbi-kyc-verify.co.in is NOT SBI's official site).",
          },
          {
            text: "Ignore the SMS and log into the official SBI app or visit a branch to check your account status",
            nextNodeId: "node-6-2",
            walletImpact: 0,
            feedback:
              "Perfect! You identified the phishing attempt. By checking through official channels, you confirmed your account is fine, this was a scam. Banks never send KYC update links via SMS. Always access your bank through bookmarked URLs or official apps.",
          },
          {
            text: "Call the number in the SMS to verify before clicking",
            nextNodeId: "node-6-2",
            walletImpact: 0,
            feedback:
              "Be careful, the phone number in a scam SMS leads to the scammer, not the bank! If you must call, look up the bank's official customer care number from their website or your debit card, never from the suspicious message itself.",
          },
        ],
        isEnd: false,
      },
      {
        nodeId: "node-6-2",
        narrative:
          "Afternoon. You're selling a used bicycle on OLX for Rs 3,000. A buyer messages you: 'I'll pay Rs 3,500 for quick delivery!' He sends you a QR code on WhatsApp saying 'Scan this to receive Rs 3,500 in your account.' What do you do?",
        timeSkip: "Later that day",
        choices: [
          {
            text: "Scan the QR code, you're receiving money so it should be safe",
            nextNodeId: "node-6-3",
            walletImpact: 0,
            feedback:
              "SCAM! That QR code was a payment REQUEST, scanning it and entering your PIN would SEND money to the scammer, not receive it. Critical rule: you NEVER need to scan a QR code or enter a PIN to receive money. If someone asks you to do this, it's always a scam.",
          },
          {
            text: "Refuse, you never need to scan a QR code to RECEIVE money",
            nextNodeId: "node-6-3",
            walletImpact: 0,
            feedback:
              "Exactly right! To receive money via UPI, you only need to share your UPI ID or phone number. The sender is the one who initiates. If someone sends YOU a QR code to 'receive' payment, it's a scam, the QR code will actually debit your account.",
          },
          {
            text: "Ask the buyer to directly transfer to your UPI ID instead",
            nextNodeId: "node-6-3",
            walletImpact: 0,
            feedback:
              "Smart! By insisting on a direct UPI transfer (where the buyer sends to your UPI ID), you eliminate the QR code scam. If the buyer refuses or insists on the QR code method, that confirms they're a scammer.",
          },
        ],
        isEnd: false,
      },
      {
        nodeId: "node-6-3",
        narrative:
          "Evening. A well-dressed person at a coffee shop strikes up a conversation. They eventually mention an exclusive 'investment club' that guarantees 25% monthly returns. 'I've already made Rs 3 lakh in 2 months!' they say, showing you screenshots of returns on their phone. Several mutual friends have also joined. They need your decision today because 'spots are limited.' What do you do?",
        timeSkip: "That evening",
        choices: [
          {
            text: "Join with a small amount, if mutual friends are in it, it must be legitimate",
            nextNodeId: "node-6-4",
            walletImpact: 0,
            feedback:
              "SCAM! This is a textbook Ponzi scheme. Red flags everywhere: 'guaranteed' high returns (25% monthly = 300% annual, no legitimate investment does this), urgency ('decide today'), social proof (friends are in it), and screenshots (easily faked). Your mutual friends are either unknowing victims or part of the recruitment chain.",
          },
          {
            text: "Decline firmly, guaranteed 25% monthly returns is a mathematical impossibility for any legitimate investment",
            nextNodeId: "node-6-4",
            walletImpact: 0,
            feedback:
              "You spotted the Ponzi scheme immediately! India's best equity funds average 12-15% per YEAR. Anyone promising 25% per MONTH (300% annually) is running a scam. The screenshots are either fake or showing early returns paid from new investors' money, classic Ponzi.",
          },
          {
            text: "Ask for their SEBI registration number and company details before deciding",
            nextNodeId: "node-6-4",
            walletImpact: 0,
            feedback:
              "Good instinct to verify, but in practice, scammers either provide fake registration numbers or deflect with 'We're too exclusive for SEBI regulation.' The 25% monthly return promise alone is a dealbreaker, no amount of documentation can make that legitimate.",
          },
        ],
        isEnd: false,
      },
      {
        nodeId: "node-6-4",
        narrative:
          "Night. You get a call from someone claiming to be from 'Amazon Customer Support.' They say a Rs 15,000 order was placed from your account and ask you to install AnyDesk (a screen-sharing app) so they can help you 'cancel the order and process a refund.' They sound professional and have your name and email. What do you do?",
        timeSkip: "Later that night",
        choices: [
          {
            text: "Install AnyDesk, they need to see your screen to process the refund",
            nextNodeId: "node-6-end-bad",
            walletImpact: 0,
            feedback:
              "CRITICAL SCAM! Once you install AnyDesk and share the access code, the scammer can see everything on your phone, including your banking apps, OTPs, and passwords. They'll transfer money out of your accounts in minutes. No legitimate company EVER asks you to install screen-sharing software.",
          },
          {
            text: "Hang up immediately, check your Amazon account directly through the app for any unauthorized orders",
            nextNodeId: "node-6-end-good",
            walletImpact: 0,
            feedback:
              "Perfect response! You checked the Amazon app directly and found no unauthorized order, confirming the call was a scam. Never install screen-sharing apps (AnyDesk, TeamViewer, QuickSupport) when someone asks you to. And never trust caller ID, scammers can spoof official numbers.",
          },
          {
            text: "Ask them to verify by sending an email from an official Amazon address",
            nextNodeId: "node-6-end-ok",
            walletImpact: 0,
            feedback:
              "Attempting verification is better than blindly complying, but scammers can sometimes send emails that look convincingly official. The safest approach is to always hang up and check through the official app/website yourself, never through any link or method the caller provides.",
          },
        ],
        isEnd: false,
      },
      {
        nodeId: "node-6-end-good",
        narrative:
          "Congratulations, you survived Scam City without losing a rupee! You identified phishing SMS attacks, QR code scams, Ponzi schemes, and screen-sharing fraud. Your defenses: never click SMS links, never scan QR codes to 'receive' money, recognize impossible return promises, and never install screen-sharing apps for strangers. Share this knowledge, your awareness could save someone from losing their life savings.",
        timeSkip: null,
        choices: [],
        isEnd: true,
      },
      {
        nodeId: "node-6-end-ok",
        narrative:
          "You caught most of the scams but had some close calls. The scam landscape is constantly evolving, but the red flags remain the same: urgency, requests for OTPs/PINs, too-good-to-be-true returns, and requests to install software. When in doubt, hang up/ignore and verify through official channels. Stay vigilant!",
        timeSkip: null,
        choices: [],
        isEnd: true,
      },
      {
        nodeId: "node-6-end-bad",
        narrative:
          "The scammers got you on some rounds. But now you know the playbook: phishing links, QR code fraud, Ponzi schemes, and screen-sharing hacks. Remember the three nevers: NEVER share your OTP/PIN, NEVER click links in SMS for 'urgent' banking issues, and NEVER install screen-sharing apps when asked. This knowledge is your shield, use it.",
        timeSkip: null,
        choices: [],
        isEnd: true,
      },
    ],
  },
];
