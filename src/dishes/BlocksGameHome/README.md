# BlocksGameHome

BlocksGame is a mini-project, a Tetris-like game inspired from an Instagram ad. It demonstrates a modern approach to state and UI management using a custom **Manager-Entity-Component** architecture, moving away from the traditional store-dispatch (Redux-like) patterns. This project is also built to utilize **Reanimated** for smooth and performant animations throughout the game experience.

## Architecture Overview

### Manager-Entity-Component Pattern

- **Component**: Represents the UI layer (React components). Components are not directly responsible for managing their own state or business logic.
- **Entity**: Regular JavaScript/TypeScript class instances that encapsulate business logic and state for a specific domain (e.g., Block, BlockSet, GameBoard). Entities are not tied to the UI and can be reused or tested independently.
- **Manager**: Orchestrates and manages entities, handling game logic, coordination, and state updates. Managers can control entities and trigger updates across the system. **Manager itself is also an entity and is UI binded to its corresponding component via UIBinder, allowing its state to be directly reflected in the UI.**

### UIBinder

A key part of this architecture is the `UIBinder` class, which acts as a bridge between entities and components. It allows components to subscribe to entity state changes and reactively update the UI. This means:

- Components are associated with entities via a UIBinder instance.
- Managers can update entities, and those changes are automatically reflected in the UI through UIBinder.
- Components can be controlled from anywhere in the codebase, making the architecture intuitive and flexible.

## Benefits

- **Decoupling**: UI logic is separated from business logic, making code easier to maintain and test.
- **Intuitive Control**: Managers can control entities and, by extension, the UI, from anywhere, without complex dispatch chains.
- **Reactive Updates**: UIBinder ensures that UI components stay in sync with entity state.
- **Scalability**: New features and entities can be added without major refactoring.

## Folder Structure

- `components/`: UI components for the game.
- `core/entities/`: Entity classes representing game objects and logic.
- `core/managers/`: Manager classes that orchestrate game flow and entity interactions.
- `core/base/UIBinder.ts`: The UIBinder implementation.
- `core/types.ts`, `core/constants.ts`: Shared types and constants.
- `TODO-NOTES.txt`: Developer notes, architectural thoughts, and ideas for future improvements and refactoring.

## Why Not Store-Dispatch?

This project intentionally avoids the store-dispatch (Redux-like) pattern to:

- Demonstrate this new way of doing things.
- Reduce boilerplate.
- Make state management more direct and intuitive.
- Allow for more granular control over UI updates and business logic.

---

> **Note from the author:**
>
> This mini-project is a demonstration of a potential architecture that shows particular promise for small, game-like projects. With further planning and refinement, this approach could mature and be adapted for broader use cases. While this implementation is not perfect and there is always room for improvement, the intention is to provide a new perspective and inspire different ways of thinking about UI and state management. Feedback and ideas for improvement are always welcome.
>
> **Related Patterns & Inspirations:**
>
> This architecture shares similarities with established patterns such as MVC (Model-View-Controller), MVVM (Model-View-ViewModel), the Observer pattern, and Entity-Component-System (ECS) from game development. However, the Manager-Entity-Component approach presented here was not explicitly modified from those underlying patterns. Rather, it was developed as a pure intuitive solution for the project's needs, and only later did its similarities to these patterns become apparent. This implementation emphasizes direct UI binding and intuitive control.
