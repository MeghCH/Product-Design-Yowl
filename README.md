## Yowl Project

### Overview

This project is a web application designed to help users track, remember, and discover cultural content such as movies, series, books, or games.
Users can log what they have already experienced, leave reviews, and receive personalized recommendations based on their tastes and behavior.

**The goal is to solve common problems such as:**

- Forgetting what you have already seen, read, or played.

- Having trouble finding new content that really matches your tastes.

- Lacking a single place to organize cultural experiences.

The front-end is built with **React.js** and styled using **Tailwind CSS** to provide a dynamic, responsive, and modern user experience, and a MySQL database.

---

## Installation & Run Instructions

### Prerequisites

### Installation

### Run in Development Mode

---

## Deployment Instructions

---

## Justification of Technical Choices

### React (Front-end)

- Component-based architecture makes the app modular and maintainable.

- Efficient state management for dynamic content (lists, reviews, recommendations).

- Large ecosystem and community support.

- Easy integration with design tools and APIs.

### Tailwind CSS

- Utility-first approach for fast UI development.

- Consistent design system through reusable utility classes.

- Easy responsive design and accessibility-friendly styling.

- No large custom CSS files, improving maintainability.

### My SQL

- It is a relational database, which is ideal for structured data like users, movies, reviews, lists, and ratings.

- It works well with web applications and integrates easily with many back-end technologies.

- Scalable and well-structured data.

### Tooling

- Vite for fast development and build.

- JavaScript.

- Responsive design for mobile and desktop users.

These choices allow fast prototyping, good performance, and scalability.

---

## Prototype

Clickable Figma prototype :
Link :

---

## /docs Structure

```bash
/docs
│
├── 01*research/
│ ├── benchmark.md
│ ├── interviews.md
│ ├── problem_statement.md
│ └── objectives_constraints.md
│
├── 02_personas/
│ ├── persona*\*.md
│ └── user_journey.md
│
├── 04_wireframes/
│ └── Low-fidelity wireframes (PDF, PNG, Figma export)
│
├── 05_mockups/
│ └── High-fidelity mockups + design and accessibility justifications
│
└── 06_prototype/
└── Link to clickable prototype + interaction description

├── 07_feedback/
└── test_protocol.md
└── feedback_summary.md

├── 08_prioritization/
└── prioritization_matrix.md
└── mvp_definition.md

└── 09_pitch/
└──pitch_deck.pdf
│
mvp/
└── <source code of the web application>
```

### Description

**01_research:** Market and user research, interviews, and problem definition.

**02_personas:** Personas and user journey scenarios.

**04_wireframes:** Low-fidelity layouts of main screens.

**05_mockups:** High-fidelity designs with design and accessibility choices.

**06_prototype:** Interactive prototype and supported interactions.

**07_feedback:** Contains user feedback after prototype testing.

**08_prioritization:** Definition of product priorities, with a prioritization matrix (MoSCoW, RICE ...) justifying the choices, and a precise definition of the MVP, main user flow - essential screens - minimal features - intentionally excluded elements.

This document defines the scope of Phase 2.

**09_pitch:** Concise presentation including: the problem - target users - the concept - the UX journey - the MVP scope

**_This documentation supports all design and development decisions made in the project._**

**mvp:** Contains the source code of the web application (React + Tailwind + MySQL).
