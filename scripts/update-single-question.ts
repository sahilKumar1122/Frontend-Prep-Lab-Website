import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const improvedAnswer = `#### 🎯 Quick Summary

Angular architecture includes modules (feature organization), components (UI building blocks), templates (HTML with directives), dependency injection (service management), services (business logic), directives (DOM manipulation), pipes (data transformation), and routing (navigation). All orchestrated via decorators and metadata.

# Answer

#### 📖 Understanding the Concept

**What is Angular's Core Architecture?**

Angular's architecture is built on **eight fundamental building blocks** that work together to create a complete, opinionated framework for building web applications. Unlike libraries that focus on one aspect (like React focusing on UI), Angular provides a comprehensive solution with integrated tools for every layer of application development.

**The Eight Core Building Blocks:**

1. **Modules (@NgModule)** - Organize application into cohesive feature sets
2. **Components (@Component)** - UI building blocks with templates and logic
3. **Templates** - HTML enhanced with Angular directives and binding syntax
4. **Metadata (Decorators)** - Configuration via @Component, @Injectable, @Directive
5. **Data Binding** - Synchronize data between component and view automatically
6. **Directives** - Add behavior to DOM elements or create structural changes
7. **Services** - Reusable business logic injected via dependency injection
8. **Dependency Injection** - Provide dependencies to components/services

**Why Does Angular's Architecture Matter?**

Angular's architecture provides:

✅ **Separation of Concerns**: Clear boundaries between UI, logic, and data
✅ **Testability**: DI enables easy mocking and unit testing
✅ **Reusability**: Services and components are easily shared
✅ **Maintainability**: Consistent structure across large teams
✅ **Scalability**: Lazy loading and modular organization
✅ **Type Safety**: TypeScript throughout the stack

Without understanding Angular's architecture:

❌ **Tight Coupling**: Components directly accessing DOM or backend
❌ **Testing Difficulty**: Hard-coded dependencies prevent mocking
❌ **Code Duplication**: Business logic scattered across components
❌ **Poor Performance**: Missing lazy loading, inefficient change detection
❌ **Team Conflicts**: Inconsistent patterns, merge conflicts

**How Angular Architecture Works:**

Angular applications follow a **hierarchical component tree** starting from a root component (typically AppComponent). Each component has:

- **Template**: Defines the view (HTML + Angular syntax)
- **Class**: Contains data and methods (TypeScript)
- **Metadata**: Configuration via @Component decorator
- **Styles**: Scoped CSS (optional)

Services are **singleton** (by default with \`providedIn: 'root'\`) and injected via constructor, enabling **loose coupling** and **dependency inversion**. The **DI container** creates and manages service instances automatically.


#### Angular Core Architecture Deep Dive

#### 1. Architecture Diagram

\`\`\`mermaid
graph TB
    subgraph Browser["Browser Environment"]
        subgraph Angular["Angular Application"]
            Root[Root Module<br/>AppModule]
            
            subgraph Core["Core Services Layer"]
                HTTP[HttpClient]
                Router[Router]
                DI[DI Container]
            end
            
            subgraph Components["Component Tree"]
                App[AppComponent<br/>Root]
                Header[HeaderComponent]
                Main[MainComponent]
                Footer[FooterComponent]
                Child1[Feature Component 1]
                Child2[Feature Component 2]
            end
            
            subgraph Services["Service Layer"]
                UserSvc[UserService]
                AuthSvc[AuthService]
                DataSvc[DataService]
            end
            
            subgraph Directives["Directives & Pipes"]
                CustomDir[Custom Directives]
                CustomPipe[Custom Pipes]
            end
        end
        
        DOM[DOM]
        
        App --> Header
        App --> Main
        App --> Footer
        Main --> Child1
        Main --> Child2
        
        Child1 -.inject.-> UserSvc
        Child2 -.inject.-> DataSvc
        UserSvc -.inject.-> HTTP
        AuthSvc -.inject.-> HTTP
        
        Components --> DOM
        Router -.controls.-> Components
        
        style Root fill:#f9f,stroke:#333,stroke-width:4px
        style DI fill:#bbf,stroke:#333,stroke-width:2px
        style App fill:#bfb,stroke:#333,stroke-width:2px
    end
\`\`\`

#### 2. The Eight Building Blocks in Detail

**1. Modules (@NgModule)**

Modules organize related code into cohesive units:

\`\`\`typescript
// Feature Module
@NgModule({
  declarations: [
    // Components, Directives, Pipes this module owns
    UserListComponent,
    UserDetailComponent,
    UserCardDirective
  ],
  imports: [
    // Other modules whose exported classes are needed
    CommonModule,        // ngIf, ngFor, etc.
    FormsModule,         // ngModel
    SharedModule,        // Shared components
    UserRoutingModule    // Routes
  ],
  providers: [
    // Services available to this module
    UserService,
    UserResolver
  ],
  exports: [
    // Components/Directives/Pipes available to importers
    UserListComponent
  ]
})
export class UserModule { }

// Root Module
@NgModule({
  declarations: [AppComponent, NavbarComponent],
  imports: [
    BrowserModule,      // Required for browser apps
    HttpClientModule,   // HTTP client
    UserModule,         // Feature module
    ProductModule       // Feature module
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]  // Root component to bootstrap
})
export class AppModule { }
\`\`\`

**2. Components (@Component)**

Components are the fundamental UI building blocks:

\`\`\`typescript
@Component({
  selector: 'app-user-card',           // How to use in HTML
  templateUrl: './user-card.component.html',  // External template
  styleUrls: ['./user-card.component.css'],   // Scoped styles
  changeDetection: ChangeDetectionStrategy.OnPush,  // Performance
  encapsulation: ViewEncapsulation.Emulated         // Style scoping
})
export class UserCardComponent implements OnInit, OnDestroy {
  // Input from parent
  @Input() user: User;
  @Input() displayMode: 'compact' | 'full' = 'compact';
  
  // Output to parent
  @Output() userSelected = new EventEmitter<User>();
  @Output() userDeleted = new EventEmitter<string>();
  
  // Template queries
  @ViewChild('userForm') userForm: ElementRef;
  @ViewChildren(ButtonComponent) buttons: QueryList<ButtonComponent>;
  
  // Local state
  isEditing = false;
  editForm: FormGroup;
  
  // Injected dependencies
  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {}
  
  ngOnInit() {
    this.editForm = this.fb.group({
      name: [this.user.name, Validators.required],
      email: [this.user.email, [Validators.required, Validators.email]]
    });
  }
  
  onSelect() {
    this.userSelected.emit(this.user);
  }
  
  onDelete() {
    this.userDeleted.emit(this.user.id);
  }
  
  ngOnDestroy() {
    // Cleanup subscriptions, timers, etc.
  }
}
\`\`\`

**3. Templates (Enhanced HTML)**

Templates use Angular's declarative syntax:

\`\`\`html
<!-- Interpolation -->
<h1>{{ title }}</h1>
<p>User: {{ user.name }}</p>

<!-- Property Binding -->
<img [src]="user.avatarUrl" [alt]="user.name">
<button [disabled]="!isValid">Submit</button>

<!-- Event Binding -->
<button (click)="onSave()">Save</button>
<input (input)="onSearch($event.target.value)">

<!-- Two-Way Binding -->
<input [(ngModel)]="username">

<!-- Structural Directives -->
<div *ngIf="isLoggedIn; else loginTemplate">
  Welcome {{ user.name }}!
</div>
<ng-template #loginTemplate>
  Please log in
</ng-template>

<ul>
  <li *ngFor="let item of items; trackBy: trackById; let i = index">
    {{ i + 1 }}. {{ item.name }}
  </li>
</ul>

<!-- Attribute Directives -->
<div [ngClass]="{'active': isActive, 'disabled': !isEnabled}">
<div [ngStyle]="{'color': textColor, 'font-size': fontSize + 'px'}">

<!-- Pipes -->
<p>{{ price | currency:'USD':'symbol':'1.2-2' }}</p>
<p>{{ birthday | date:'fullDate' }}</p>
<p>{{ longText | slice:0:100 }}...</p>

<!-- Template Reference Variables -->
<input #searchBox (keyup)="onSearch(searchBox.value)">
<app-user-card #userCard [user]="user"></app-user-card>
<button (click)="userCard.refresh()">Refresh</button>
\`\`\`

**4. Metadata (Decorators)**

Decorators attach metadata to classes:

\`\`\`typescript
// Component Decorator
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [DashboardService],  // Component-level services
  host: {                          // Host element properties
    'class': 'dashboard-container',
    '[class.active]': 'isActive'
  }
})
export class DashboardComponent { }

// Injectable Decorator (Services)
@Injectable({
  providedIn: 'root'  // Singleton, tree-shakeable
})
export class UserService { }

// Directive Decorator
@Directive({
  selector: '[appHighlight]'
})
export class HighlightDirective { }

// Pipe Decorator
@Pipe({
  name: 'exponential',
  pure: true  // Only recalculate when input changes
})
export class ExponentialPipe implements PipeTransform { }
\`\`\`

**5. Data Binding (Four Types)**

\`\`\`typescript
@Component({
  template: \`
    <!-- 1. Interpolation (Component → View) -->
    <h1>{{ pageTitle }}</h1>
    
    <!-- 2. Property Binding (Component → View) -->
    <img [src]="imageUrl">
    <app-user [user]="currentUser">
    
    <!-- 3. Event Binding (View → Component) -->
    <button (click)="handleClick()">Click Me</button>
    <app-user (userSelected)="onUserSelected($event)">
    
    <!-- 4. Two-Way Binding (Component ↔ View) -->
    <input [(ngModel)]="searchText">
    <!-- Expands to: -->
    <input [ngModel]="searchText" 
           (ngModelChange)="searchText = $event">
  \`
})
export class ExampleComponent {
  pageTitle = 'My App';
  imageUrl = '/assets/logo.png';
  currentUser = { name: 'John', id: 1 };
  searchText = '';
  
  handleClick() {
    console.log('Button clicked');
  }
  
  onUserSelected(user: User) {
    console.log('Selected:', user);
  }
}
\`\`\`

**6. Directives (Three Types)**

\`\`\`typescript
// A. Structural Directives (Change DOM Layout)
@Directive({
  selector: '[appUnless]'
})
export class UnlessDirective {
  @Input() set appUnless(condition: boolean) {
    if (!condition) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
  
  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ) {}
}

// Usage: <div *appUnless="isHidden">Visible when NOT hidden</div>

// B. Attribute Directives (Change Appearance/Behavior)
@Directive({
  selector: '[appHighlight]'
})
export class HighlightDirective implements OnInit {
  @Input() appHighlight = 'yellow';
  @Input() defaultColor = 'transparent';
  
  @HostListener('mouseenter') onMouseEnter() {
    this.highlight(this.appHighlight);
  }
  
  @HostListener('mouseleave') onMouseLeave() {
    this.highlight(this.defaultColor);
  }
  
  constructor(private el: ElementRef, private renderer: Renderer2) {}
  
  private highlight(color: string) {
    this.renderer.setStyle(this.el.nativeElement, 'backgroundColor', color);
  }
}

// Usage: <p appHighlight="lightblue">Hover me</p>

// C. Components (Directives with Template)
// Already covered above
\`\`\`

**7. Services (Business Logic)**

\`\`\`typescript
// Service with DI
@Injectable({
  providedIn: 'root'  // Single instance for entire app
})
export class UserService {
  private apiUrl = '/api/users';
  private usersSubject = new BehaviorSubject<User[]>([]);
  public users$ = this.usersSubject.asObservable();
  
  constructor(
    private http: HttpClient,
    private logger: LoggerService
  ) {
    this.loadUsers();
  }
  
  private loadUsers() {
    this.http.get<User[]>(this.apiUrl).pipe(
      tap(users => this.logger.log('Users loaded:', users.length)),
      catchError(error => {
        this.logger.error('Failed to load users', error);
        return of([]);
      })
    ).subscribe(users => {
      this.usersSubject.next(users);
    });
  }
  
  getUser(id: string): Observable<User> {
    return this.http.get<User>(\`\${this.apiUrl}/\${id}\`);
  }
  
  createUser(user: Partial<User>): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }
  
  updateUser(id: string, user: Partial<User>): Observable<User> {
    return this.http.patch<User>(\`\${this.apiUrl}/\${id}\`, user);
  }
  
  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(\`\${this.apiUrl}/\${id}\`);
  }
}

// Component-level service (new instance per component)
@Component({
  providers: [LocalStorageService]  // Component-scoped
})
export class SettingsComponent {
  constructor(private storage: LocalStorageService) {
    // Gets unique instance
  }
}
\`\`\`

**8. Dependency Injection**

\`\`\`typescript
// Hierarchical Injectors
// Root Injector (App-wide singletons)
@Injectable({ providedIn: 'root' })
export class ApiService { }

// Module Injector
@NgModule({
  providers: [FeatureService]  // Available to module and children
})
export class FeatureModule { }

// Component Injector
@Component({
  providers: [LocalService]  // New instance per component
})
export class MyComponent { }

// Constructor Injection
export class UserComponent {
  constructor(
    private userService: UserService,      // Root injector
    private router: Router,                // Root injector
    private route: ActivatedRoute,         // Router injector
    @Optional() private config: AppConfig, // Optional dependency
    @Self() private local: LocalService,   // Only from this injector
    @SkipSelf() private parent: ParentService  // Skip this, use parent
  ) {}
}

// Property Injection (less common)
export class MyComponent {
  @Inject(UserService) userService: UserService;
}

// Factory Providers
export function userServiceFactory(http: HttpClient, config: AppConfig) {
  return new UserService(http, config.apiUrl);
}

@NgModule({
  providers: [
    {
      provide: UserService,
      useFactory: userServiceFactory,
      deps: [HttpClient, AppConfig]
    }
  ]
})

// InjectionToken for non-class dependencies
export const API_URL = new InjectionToken<string>('apiUrl');

@NgModule({
  providers: [
    { provide: API_URL, useValue: 'https://api.example.com' }
  ]
})

// Usage
constructor(@Inject(API_URL) private apiUrl: string) { }
\`\`\`

#### 3. Angular vs React Architecture Comparison

| Aspect | Angular | React |
|--------|---------|-------|
| **Type** | Full-featured framework | UI library |
| **Architecture** | MVC/MVVM with DI | Component-based |
| **Language** | TypeScript (required) | JavaScript/TypeScript (optional) |
| **Data Flow** | Two-way binding | One-way (props down, events up) |
| **State Management** | RxJS, Services (built-in) | Context API, Redux (external) |
| **Routing** | @angular/router (built-in) | React Router (external) |
| **Forms** | Template-driven, Reactive | Controlled/Uncontrolled |
| **HTTP** | HttpClient (built-in) | fetch/axios (external) |
| **DI** | Constructor injection | Context API, props |
| **Change Detection** | Zone.js, Signals | Virtual DOM diffing |
| **Testing** | Jasmine, Karma (built-in) | Jest (external) |
| **CLI** | Angular CLI (powerful) | Create React App, Vite |
| **Bundle Size** | ~500KB (min) | ~100KB (min) |
| **Learning Curve** | Steep | Moderate |
| **Opinionated** | Highly | Minimal |

**Code Comparison:**

\`\`\`typescript
// ============ ANGULAR ============
// user-list.component.ts
@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  users$: Observable<User[]>;
  selectedUser: User | null = null;
  
  constructor(
    private userService: UserService,
    private router: Router
  ) {}
  
  ngOnInit() {
    this.users$ = this.userService.getUsers();
  }
  
  onSelectUser(user: User) {
    this.selectedUser = user;
  }
  
  onDeleteUser(userId: string) {
    this.userService.deleteUser(userId).subscribe(() => {
      this.users$ = this.userService.getUsers();
    });
  }
}

// user-list.component.html
<div class="user-list">
  <h2>Users</h2>
  <div *ngFor="let user of users$ | async" 
       class="user-card"
       [class.selected]="user === selectedUser"
       (click)="onSelectUser(user)">
    <h3>{{ user.name }}</h3>
    <p>{{ user.email }}</p>
    <button (click)="onDeleteUser(user.id); $event.stopPropagation()">
      Delete
    </button>
  </div>
</div>

// ============ REACT ============
// UserList.tsx
import { useState, useEffect } from 'react';
import { useUserService } from './hooks/useUserService';

export function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const userService = useUserService();
  
  useEffect(() => {
    userService.getUsers().then(setUsers);
  }, []);
  
  const handleSelectUser = (user: User) => {
    setSelectedUser(user);
  };
  
  const handleDeleteUser = (userId: string) => {
    userService.deleteUser(userId).then(() => {
      userService.getUsers().then(setUsers);
    });
  };
  
  return (
    <div className="user-list">
      <h2>Users</h2>
      {users.map(user => (
        <div
          key={user.id}
          className={\`user-card \${user === selectedUser ? 'selected' : ''}\`}
          onClick={() => handleSelectUser(user)}
        >
          <h3>{user.name}</h3>
          <p>{user.email}</p>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteUser(user.id);
            }}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
\`\`\`

#### 4. When to Choose Angular

**Choose Angular when you need:**

✅ **Enterprise Applications**: Large-scale apps with many developers  
✅ **Consistency**: Opinionated structure keeps teams aligned  
✅ **Type Safety**: TypeScript enforced throughout  
✅ **Batteries Included**: Don't want to choose routing, forms, HTTP libraries  
✅ **DI System**: Need powerful dependency injection  
✅ **RxJS**: Heavy async operations, streaming data  
✅ **Long-term Maintenance**: Well-defined upgrade path  

**Choose React when you need:**

✅ **Flexibility**: Want to choose your own libraries  
✅ **Smaller Bundle**: Performance critical applications  
✅ **Gradual Adoption**: Adding interactivity to existing sites  
✅ **Mobile**: React Native for mobile apps  
✅ **Simpler Learning**: Easier onboarding  
✅ **Community**: Larger ecosystem and job market  

#### 5. Modern Angular (2024+)

**Standalone Components (Angular 14+)**

\`\`\`typescript
// No NgModule needed!
@Component({
  selector: 'app-user-card',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule],
  template: \`
    <div *ngIf="user">
      <h3>{{ user.name }}</h3>
      <button mat-button (click)="onEdit()">Edit</button>
    </div>
  \`
})
export class UserCardComponent {
  @Input() user: User;
  @Output() edit = new EventEmitter<void>();
  
  onEdit() {
    this.edit.emit();
  }
}

// Bootstrap standalone component
bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideAnimations()
  ]
});
\`\`\`

**Signals (Angular 16+)**

\`\`\`typescript
export class CounterComponent {
  // Writable signal
  count = signal(0);
  
  // Computed signal (auto-updates)
  doubleCount = computed(() => this.count() * 2);
  
  // Effect (side effects)
  constructor() {
    effect(() => {
      console.log('Count changed:', this.count());
    });
  }
  
  increment() {
    this.count.update(n => n + 1);
  }
  
  reset() {
    this.count.set(0);
  }
}

// Template (note the function call syntax)
<p>Count: {{ count() }}</p>
<p>Double: {{ doubleCount() }}</p>
<button (click)="increment()">+</button>
\`\`\`

**Zoneless Change Detection (Experimental)**

\`\`\`typescript
// main.ts
bootstrapApplication(AppComponent, {
  providers: [
    provideExperimentalZonelessChangeDetection()  // No Zone.js!
  ]
});

// Components use Signals for reactivity
export class TodoComponent {
  todos = signal<Todo[]>([]);
  filter = signal<'all' | 'active' | 'completed'>('all');
  
  filteredTodos = computed(() => {
    const todos = this.todos();
    const filter = this.filter();
    
    if (filter === 'active') return todos.filter(t => !t.completed);
    if (filter === 'completed') return todos.filter(t => t.completed);
    return todos;
  });
}
\`\`\`

#### Key Takeaways

✅ **Angular = Complete Framework**: Routing, HTTP, Forms, Testing all built-in  
✅ **8 Core Building Blocks**: Modules, Components, Templates, Metadata, Binding, Directives, Services, DI  
✅ **Opinionated**: One way to do things, great for large teams  
✅ **TypeScript First**: Type safety everywhere  
✅ **DI is Central**: Constructor injection, hierarchical injectors  
✅ **RxJS Everywhere**: Observables for async operations  
✅ **Modern Features**: Standalone components, Signals, Zoneless  
✅ **vs React**: More batteries included, steeper learning curve, larger bundle

#### ⚠️ Common Pitfalls & Best Practices

**Common Mistakes:**

❌ **Mistake 1: Not understanding hierarchical DI**
\`\`\`typescript
// WRONG: Providing service in multiple places creates multiple instances
@Component({
  providers: [UserService]  // ❌ New instance per component!
})

// RIGHT: Use providedIn for singletons
@Injectable({ providedIn: 'root' })
export class UserService { }
\`\`\`

❌ **Mistake 2: Forgetting to unsubscribe**
\`\`\`typescript
// WRONG: Memory leak
ngOnInit() {
  this.userService.getUsers().subscribe(users => {
    this.users = users;  // ❌ Never unsubscribes!
  });
}

// RIGHT: Use async pipe or takeUntil
users$ = this.userService.getUsers();  // ✅ Template: users$ | async
\`\`\`

❌ **Mistake 3: Heavy logic in components**
\`\`\`typescript
// WRONG: Business logic in component
export class UserComponent {
  saveUser(user: User) {
    // ❌ HTTP call directly in component
    this.http.post('/api/users', user).subscribe(/* ... */);
  }
}

// RIGHT: Use services
export class UserComponent {
  constructor(private userService: UserService) {}
  
  saveUser(user: User) {
    this.userService.create(user).subscribe(/* ... */);  // ✅
  }
}
\`\`\`

**Best Practices:**

✅ **Practice 1: Follow Single Responsibility Principle**
- Components: UI logic only
- Services: Business logic
- Directives: DOM manipulation
- Pipes: Data transformation

✅ **Practice 2: Use OnPush change detection**
\`\`\`typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush  // ✅ Better performance
})
\`\`\`

✅ **Practice 3: Prefer async pipe over manual subscriptions**
\`\`\`html
<!-- GOOD -->
<div *ngFor="let user of users$ | async">{{ user.name }}</div>
\`\`\`

✅ **Practice 4: Use trackBy with *ngFor**
\`\`\`html
<div *ngFor="let item of items; trackBy: trackById">
\`\`\`

#### 🎯 Interview Tips

**How to Explain Angular Architecture:**

**30-Second Answer:**
> "Angular architecture consists of eight core building blocks: Modules organize features, Components define UI, Templates are enhanced HTML, Metadata configures via decorators, Data Binding syncs view and model, Directives manipulate DOM, Services contain business logic, and Dependency Injection provides loose coupling. It's a complete, opinionated framework with everything built-in - routing, HTTP, forms - unlike React which is just a UI library."

**2-Minute Deep Dive:**
1. Start with the eight building blocks
2. Explain hierarchical component tree
3. Highlight DI as the "glue"
4. Compare briefly with React
5. Mention modern features (Standalone, Signals)

**Common Follow-ups:**

**Q: "What's the difference between Angular and React?"**
- Angular: Complete framework, opinionated, TypeScript
- React: UI library, flexible, JavaScript/TypeScript optional
- Use cases for each

**Q: "Explain Angular's dependency injection"**
- Constructor injection
- Hierarchical injectors (root, module, component)
- providedIn: 'root' for tree-shakeable singletons
- Benefits: testability, loose coupling

**Q: "What are the performance considerations?"**
- OnPush change detection
- Lazy loading modules
- TrackBy for *ngFor
- Async pipe over manual subscriptions
- Signals for fine-grained reactivity

**Red Flags:**
- ❌ Can't explain difference between Module and Component
- ❌ Don't know what dependency injection is
- ❌ Never heard of OnPush change detection
- ❌ Think Angular and AngularJS are the same

**Green Flags:**
- ✅ Can draw architecture diagram
- ✅ Explain DI with examples
- ✅ Compare with React thoughtfully
- ✅ Mention modern features (Standalone, Signals)
- ✅ Discuss performance optimizations

#### 📚 Related Topics

- **Angular Change Detection** - How updates propagate through component tree
- **RxJS and Observables** - Reactive programming in Angular
- **Dependency Injection Deep Dive** - Hierarchical injectors, providers
- **Angular Modules vs Standalone** - Traditional vs modern approaches
- **State Management** - Services, RxJS, NgRx
- **Performance Optimization** - OnPush, lazy loading, preloading strategies
`;

async function updateQuestion() {
  const question = await prisma.question.findFirst({
    where: {
      slug: 'angular-what-is-angulars-core-architecture'
    }
  });

  if (!question) {
    console.error('❌ Question not found');
    process.exit(1);
  }

  await prisma.question.update({
    where: { id: question.id },
    data: { answer: improvedAnswer }
  });

  console.log('✅ Successfully updated: What is Angular\'s Core Architecture?');
  console.log('\n📝 Changes made:');
  console.log('- Replaced generic template with specific Angular architecture content');
  console.log('- Added detailed explanation of 8 core building blocks');
  console.log('- Included comprehensive code examples for each concept');
  console.log('- Added architecture diagrams');
  console.log('- Improved Angular vs React comparison');
  console.log('- Added modern Angular features (Standalone, Signals, Zoneless)');

  await prisma.$disconnect();
}

updateQuestion().catch(console.error);

