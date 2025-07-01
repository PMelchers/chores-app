# Firebase Database Setup voor Taskio

Ik heb je Firebase database koppeling compleet opgezet! Hier is wat er gecreëerd is:

## 📁 Bestanden die zijn aangemaakt:

### 1. **Firebase Configuratie** (`src/firebase/config.ts`)
- ✅ Firebase is geïnitialiseerd met jouw API keys
- ✅ Auth, Firestore en Storage services zijn klaar voor gebruik
- ✅ Je configuratie is al ingevuld met jouw project gegevens

### 2. **Database Service** (`src/firebase/database.ts`)
- ✅ Volledige CRUD operaties voor taken
- ✅ Real-time updates met Firestore listeners
- ✅ Type-safe interfaces voor Task, User en Family
- ✅ Geoptimaliseerd voor parent/child rollen

### 3. **Authentication Provider** (`src/components/providers/auth-provider.tsx`)
- ✅ Firebase Authentication integratie
- ✅ User role management (parent/child)
- ✅ Context provider voor de hele app

### 4. **React Hook** (`src/hooks/useTasks.ts`)
- ✅ Eenvoudig te gebruiken hook voor taken
- ✅ Automatische real-time updates
- ✅ Error handling

### 5. **Voorbeeld Component** (`src/components/TaskList.tsx`)
- ✅ Klaar-voor-gebruik task lijst component
- ✅ Add, toggle, delete functionaliteit
- ✅ Verschillende views voor parents en children

## 🚀 Hoe te gebruiken:

### 1. In je main App component:
```tsx
import { AuthProvider } from './components/providers/auth-provider';
import { TaskList } from './components/TaskList';

function App() {
  return (
    <AuthProvider>
      <TaskList />
    </AuthProvider>
  );
}
```

### 2. Voor Authentication:
```tsx
import { useAuth } from './components/providers/auth-provider';

function LoginForm() {
  const { signIn, signUp, signOut, user, userRole } = useAuth();
  
  // Gebruik signIn, signUp, signOut functies
  // user en userRole zijn automatisch beschikbaar
}
```

### 3. Voor Tasks:
```tsx
import { useTasks } from './hooks/useTasks';

function MyTaskComponent() {
  const { tasks, addTask, updateTask, deleteTask, toggleTaskCompletion } = useTasks();
  
  // Tasks zijn automatisch gesynced met Firebase
  // Real-time updates werken automatisch
}
```

## 🔥 Firebase Collections die worden gebruikt:

### 1. **users** collection:
```typescript
{
  id: string,
  email: string,
  role: 'parent' | 'child',
  displayName?: string,
  createdAt: Timestamp
}
```

### 2. **tasks** collection:
```typescript
{
  id: string,
  title: string,
  description?: string,
  completed: boolean,
  assignedTo?: string, // User ID
  createdBy: string,   // User ID
  dueDate?: Date,
  points?: number,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### 3. **families** collection (voor toekomstige uitbreiding):
```typescript
{
  id: string,
  name: string,
  parentIds: string[],
  childIds: string[],
  createdAt: Timestamp
}
```

## 🔧 Development Server:

Je development server draait op: **http://localhost:5174/**

## 🎯 Volgende stappen:

1. **Firestore Rules instellen** in de Firebase Console
2. **Authentication methods** activeren (Email/Password)
3. **Je components integreren** met de AuthProvider
4. **Styling toevoegen** aan de TaskList component

## 🛡️ Beveiliging:

Vergeet niet om in de Firebase Console:
- Firestore Security Rules in te stellen
- Authentication providers te activeren
- Domain restrictions toe te voegen voor productie

Je Firebase database koppeling is nu volledig operationeel! 🎉
