# MVP Definition — Media Catalog App (Books, Video Games, Movies, TV Series)

## 1. MVP Goal
The goal of this MVP is to allow users to **catalog media works**, **mark them as to watch / seen**, **rate them**, **write short reviews**, and **view other users’ public profiles and reviews**.

This MVP validates that:
> Users can track what they have consumed, express their opinion, and discover opinions from others.

---

## 2. Main User Flow

### Flow A — Core user journey
1. User signs up or logs in
2. User searches for a work (book / video game / movie / TV series)
3. User opens a work detail page
4. User:
   - marks the work as **To Watch / Seen**
   - gives a **rating**
   - optionally writes a **review**
5. User views and manages their personal library

### Flow B — Light social discovery
1. User opens another user’s profile
2. User browses:
   - their list of works
   - their ratings and reviews
3. User opens a work from another user’s profile

---

## 3. Essential Screens

1. **Authentication**
   - Sign up / Log in (email + password)

2. **Home / Search**
   - Search input
   - Filter by type (Book / Video Game / Movie / TV Series)
   - Search results list

3. **Work Details**
   - Title, type, cover/poster
   - Basic metadata (release year, main creator)
   - Average rating
   - User actions:
     - Mark as **To Watch / Seen**
     - Give a **rating**
     - Write / edit a **review**
   - List of recent public reviews (limited)

4. **My Library**
   - User’s works list
   - Filters:
     - Status (To Watch / Seen)
     - Type
   - Display:
     - User rating
     - Review preview
   - Edit or remove an entry

5. **User Profile**
   - Photo + username
   - Public list of rated / seen works
   - Public ratings and reviews
   - Read-only access for other users

6. **Settings (Minimal)**
   - Email
   - Log out

---

## 4. Minimal Features

### A. Works & Search
- Unified work model:
  - `id`, `type`, `title`, `coverUrl`, `year`, `creators`, `description`
- Search by title
- Work detail page

### B. User Account
- Email/password authentication
- Public user profile (username, optional avatar)

### C. User ↔ Work Interaction
- Mark a work as:
  - `TO_WATCH` / `SEEN`
- Give a **numeric rating** (e.g. 1–5 or 1–10)
- Write a **short text review**
- Edit or delete rating and review
- One entry per work per user

### D. Personal Library
- User’s personal works list
- Filter by status
- Simple sorting (date added or last updated)

### E. Social (MVP scope)
- Public user profiles
- Public reviews
- Average rating per work

---

## 5. Explicitly Excluded (Out of MVP Scope)

### Advanced Social Features
- Following users
- Activity feed
- Notifications
- Likes or reactions on reviews
- Private messaging

### Advanced Reviews & Ratings
- Comments on reviews
- Spoiler tags
- Long-form blog-style reviews
- Reactions (emojis)

### Advanced Tracking by Media Type
- TV series: season / episode tracking
- Video games: playtime, platforms
- Books: pages read, reading progress

### Discovery & Recommendations
- Personalized recommendations
- Trending / top lists
- Editorial collections
- Advanced filters (genre, cast, platform, etc.)

### Contributions & Moderation
- User-submitted works
- Review reporting or moderation tools

### Technical / Product Features
- Offline mode
- Data export
- Monetization
- Internationalization (multi-language)

---

## 6. MVP “Done” Criteria

The MVP is considered complete when:
- A user can:
  1. sign up or log in
  2. search for a work
  3. mark it as **To Watch / Seen**
  4. give it a **rating**
  5. write a **review**
  6. view and manage their library
  7. view another user’s public profile and reviews
- Ratings and reviews are publicly visible
- Loading, empty, and error states are handled properly

---
