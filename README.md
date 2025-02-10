# BadMatTon

![Logo](/logo.png)

A web application for managing badminton tournament registrations with multiple groups, featuring real-time updates and automatic waiting list management.

## Live Demo

Explore the live website at [BadMatTon](https://badmatton.vercel.app/).

## Features ✨

### Core Functionality
- **Dual Group Management**: Handle 2 separate tournament groups
  - Group 1: `participants_1` & `waiting_list_1`
  - Group 2: `participants_2` & `waiting_list_2`
- **Real-time Updates**: Instant synchronization across devices
- **Automatic Waiting List**: 
  - Limits each group to 25 main participants
  - Auto-promotes from waiting list when spots open

### Participant Management
- ✅ Add new participants
- ✏️ Toggle payment status (Paid/Unpaid)
- 🗑️ Delete participants
- 📋 Separate views for main list and waiting list

### UI/UX Features
- 🎨 Badminton-themed design
- 📱 Responsive layout
- 🚦 Visual status indicators
- 📊 Real-time participant counts
- 🎮 Interactive buttons with hover effects

## Tech Stack 💻

**Frontend**
- React.js
- CSS (Custom Badminton Theme)
- Supabase.js (Database Interface)

**Backend**
- Supabase (PostgreSQL Database)

## Installation 🛠️

1. **Clone Repository**
```bash
git clone https://https://github.com/lorenzvaldy/BadMatTon.git
cd badminton-tournament
```

2. **Install Dependencies**
```bash
npm install
```

3. **Environment Setup**
```bash
cp .env.example .env
```
Fill in your Supabase credentials:
```env
REACT_APP_RESET_PASSWORD=your-password
REACT_APP_SUPABASE_URL=your-supabase-url
REACT_APP_SUPABASE_ANON_KEY=your-anon-key
```

4. **Database Setup**
- Create 4 tables in Supabase:
  - `participants_1`
  - `waiting_list_1`
  - `participants_2`
  - `waiting_list_2`
  
  With columns:
  ```sql
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  has_paid BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
  ```

- Create 1 table for variables
  - `participants_1`
  - `waiting_list_1`
  - `participants_2`
  - `waiting_list_2`
  
  With columns:
  ```sql
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  variable_name TEXT NOT NULL,
  value INT
  ```

5. **Run Application**
```bash
npm start
```

## Usage 🚀

1. **Add Participants**
   - Enter name in input field
   - Click "Add Player"
   - Automatically assigns to main list or waiting list

2. **Manage Participants**
   - Toggle payment status with ✅/❌ buttons
   - Delete participants with 🗑️ button
   - Automatic waiting list promotion on deletion
   - Remind funtion if someone from waiting list is promoted

3. **Group Navigation**
   - Separate sections for Group 1 & Group 2
   - Identical functionality for both groups

## Database Structure 🗃️

```sql
-- Group 1 Tables
CREATE TABLE participants_1 (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  has_paid BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE waiting_list_1 (
  -- Same structure as participants_1
);

-- Group 2 Tables
CREATE TABLE participants_2 (
  -- Same structure as participants_1
);

CREATE TABLE waiting_list_2 (
  -- Same structure as participants_1
);
```

**Key Implementation Details**
- State management with React hooks
- Real-time updates via Supabase subscriptions
- Responsive CSS grid/flex layouts
- Error handling for database operations

## License 📄

MIT License - see [LICENSE](LICENSE) for details