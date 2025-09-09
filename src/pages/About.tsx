import { Card } from "../components/Card";

export const About = () => {
  return (
    <Card>
      <div style={{ maxWidth: 960, lineHeight: 1.6 }}>
        <section aria-labelledby="about-iching-title">
          <h2 id="about-iching-title">
            <u>About the I‑Ching</u>
          </h2>
          <p>
            The <em>I‑Ching</em> (易經), or <em>Book of Changes</em>, is one of
            the oldest works of wisdom in human history. Originating in ancient
            China more than 3,000 years ago, it has been studied by
            philosophers, poets, rulers, and spiritual seekers across centuries.
            At its heart, the I‑Ching is not about predicting the future—it is a
            mirror for self‑reflection. It helps us understand the patterns of
            change in life, offering perspective on challenges, decisions, and
            opportunities.
          </p>
          <p>
            The text is built upon the interplay of <strong>yin</strong> and{" "}
            <strong>yang</strong>, the complementary forces that create balance
            in the universe. These are expressed through{" "}
            <strong>hexagrams</strong>: figures made of six broken or unbroken
            lines. Each hexagram carries a symbolic meaning, drawn from natural
            imagery, philosophy, and human experience. When you consult the
            I‑Ching, you are engaging with this ancient system of symbols to
            gain insight into the present moment and the direction of change
            unfolding in your life.
          </p>
        </section>

        <section aria-labelledby="how-app-works-title">
          <h2 id="how-app-works-title">
            <u>How This App Works</u>
          </h2>
          <p>
            This app provides a modern way to connect with the wisdom of the
            I‑Ching while preserving the spirit of its traditional practice.
          </p>
          <p>
            <strong>Set Your Intention</strong>
            <br />
            Before generating a hexagram, take a moment to center yourself and
            form a clear question or reflection. The quality of your intention
            shapes the clarity of the response.
          </p>
          <p>
            <strong>Automatic Random Tosses</strong>
            <br />
            The app simulates traditional coin tosses instantly, using a fair
            random number generator. This method is fast, simple, and always
            available.
          </p>
          <p>
            <strong>Manual Tosses</strong>
            <br />
            For those who enjoy ritual, you can toss real coins yourself and
            input the results into the app. The app then calculates the hexagram
            and provides the interpretation. Detailed instructions are included
            to guide you through the process.
          </p>
          <p>
            <strong>Receive Your Hexagram and Interpretation</strong>
            <br />
            Each consultation provides not only the hexagram but also its
            meaning, imagery, and suggested reflections to help you connect its
            wisdom to your life.
          </p>
        </section>

        <section aria-labelledby="hexagram-calculation-title">
          <h2 id="hexagram-calculation-title">
            <u>How Hexagrams Are Calculated</u>
          </h2>
          <p>
            A hexagram is made of six lines, each of which can be either broken
            (yin) or unbroken (yang). Lines are built from the bottom up, one by
            one, through a process of coin tosses. In the traditional method,
            three coins are tossed at once, and the values of heads and tails
            are added to determine whether the resulting line is yin or yang.
            Repeating this process six times creates the complete hexagram.
          </p>
          <p>
            Some lines are considered “changing lines,” which indicate
            transformation. These special lines point to a second hexagram,
            showing how the situation is in motion and may evolve. Thus, an
            I‑Ching reading often presents two hexagrams: the primary one
            describing the current moment, and the transformed one revealing the
            direction of change.
          </p>
          <p>
            The 64 possible hexagrams, each with its own imagery, commentary,
            and philosophical teaching, form the heart of the I‑Ching.
            Consulting the book involves reflecting on how these symbolic
            patterns relate to your question and your life.
          </p>
        </section>

        <section aria-labelledby="randomness-title">
          <h2 id="randomness-title">
            <u>About Randomness and Meaning</u>
          </h2>
          <p>
            <strong>Computer Randomness</strong>
            <br />
            The app uses a high‑quality random number generator to mimic the
            unpredictability of physical coin tosses. While algorithmic, this
            randomness is unbiased and functions as a valid way to consult the
            I‑Ching.
          </p>
          <p>
            <strong>Physical Coin Tosses</strong>
            <br />
            Many practitioners value the tactile ritual of tossing coins. The
            rhythm of the toss, the sound of metal, and the presence of chance
            in the physical world create a meditative atmosphere. This embodied
            process can make the reading feel more alive and personal, as your
            energy and the moment itself become part of the divination.
          </p>
        </section>

        <section aria-labelledby="why-use-title">
          <h2 id="why-use-title">
            <u>Why Use the I‑Ching?</u>
          </h2>
          <p>
            The I‑Ching does not give simple yes‑or‑no answers. Instead, it
            offers <strong>images, metaphors, and wisdom</strong> that encourage
            reflection. By reading and contemplating the response, you may
            discover new perspectives, inner clarity, or a deeper connection
            with the flow of life.
          </p>
          <p>
            This app uses the <strong>Wilhelm/Baynes translation</strong>, the
            most influential and widely read version in the Western world. First
            published by Richard Wilhelm and translated into English by Cary F.
            Baynes, this edition combines scholarship with poetic depth. It has
            inspired countless thinkers and writers.
          </p>
          <p>
            <strong>Note on Carl Jung’s Foreword:</strong> The English edition
            includes a landmark foreword by the psychologist Carl Gustav Jung,
            who viewed the I‑Ching as a profound tool for engaging with
            synchronicity—the meaningful interplay between inner states and
            outer events. His foreword offers a philosophical lens that many
            readers find illuminating, especially when approaching the text as
            guidance for self‑reflection rather than prediction.
          </p>
          <p>
            Whether you use the I‑Ching for daily meditation, guidance in
            decision‑making, or simply curiosity about this timeless classic,
            this app is designed to make the I‑Ching accessible, meaningful, and
            respectful of its ancient roots.
          </p>
        </section>
      </div>
    </Card>
  );
};
