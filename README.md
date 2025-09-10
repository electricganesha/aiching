# IChingify

**IChingify** is a modern web application for consulting the I‑Ching (易經), or Book of Changes—one of humanity’s oldest works of wisdom. The I‑Ching is not about predicting the future, but about self‑reflection and understanding the patterns of change in life. This app brings the ancient practice into the digital age, making it accessible, meaningful, and respectful of its roots.

## About the I‑Ching

The I‑Ching, or Book of Changes, originated in ancient China over 3,000 years ago. It has guided philosophers, poets, rulers, and spiritual seekers for centuries. At its core, the I‑Ching uses the interplay of **yin** and **yang**—complementary forces that create balance in the universe—expressed through **hexagrams** (figures of six lines, broken or unbroken). Each hexagram carries symbolic meaning, offering perspective on challenges, decisions, and opportunities.
Consulting the I‑Ching is a process of reflection. It encourages you to set an intention, ask a question, and interpret the resulting hexagram’s imagery and wisdom in the context of your life.

## Features

- **Modern Next.js app**: Fast, responsive, and easy to use on any device.
- **Automatic random tosses**: Instantly generate hexagrams using a fair random number generator.
- **Manual coin tosses**: Prefer ritual? Toss real coins and input the results for a more meditative experience.
- **Clear instructions**: Step-by-step guidance for both automatic and manual methods.
- **Hexagram interpretation**: Each reading provides the hexagram, its meaning, imagery, and suggested reflections.
- **Wilhelm/Baynes translation**: The most influential English edition, with poetic depth and Jung’s classic foreword.

## How Hexagrams Are Calculated

A hexagram is built from six lines, each determined by a coin toss (automatic or manual). Lines are constructed from the bottom up. Some lines may be “changing lines,” indicating transformation and pointing to a second hexagram—showing how the situation may evolve.

## Randomness and Meaning

- **Computer randomness**: The app uses a high‑quality random number generator to mimic the unpredictability of physical coin tosses. This is unbiased and valid for I‑Ching consultation.
- **Physical coin tosses**: Many value the ritual of tossing coins, making the reading feel more alive and personal.

## Why Use the I‑Ching?

The I‑Ching does not give simple yes‑or‑no answers. Instead, it offers images, metaphors, and wisdom that encourage reflection. By contemplating the response, you may discover new perspectives, inner clarity, or a deeper connection with the flow of life.
This app is designed for daily meditation, guidance in decision‑making, or simply curiosity about this timeless classic.

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) (v16 or later recommended)
- npm, yarn, pnpm, or bun as your package manager

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/ichingify.git
   cd ichingify
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

### Running the Development Server

Start the development server:

```bash
npm run dev
```

Open [http://localhost:4004](http://localhost:4004) in your browser to view the application.

---

## Learn More

- [Next.js Documentation](https://nextjs.org/docs) – Learn about Next.js features and API.
- [Wilhelm/Baynes I Ching translation](<https://en.wikipedia.org/wiki/I_Ching_(Wilhelm)>)
- [Carl Jung’s Foreword](https://en.wikipedia.org/wiki/I_Ching#Carl_Jung's_foreword)

## Deployment

Deploy your application using the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme), the creators of Next.js.

For more details, refer to the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying).

---

Feel free to contribute to this project by submitting issues or pull requests. Your feedback is highly appreciated!
