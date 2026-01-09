# Database Schema - AI Novel Architect

## PostgreSQL Schema

### Users Table
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    display_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Projects Table
```sql
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(500) NOT NULL,
    book_metadata JSONB NOT NULL,
    outline JSONB NOT NULL,
    characters JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_projects_updated_at ON projects(updated_at);
```

### Chapters Table
```sql
CREATE TABLE chapters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    chapter_index INTEGER NOT NULL,
    title VARCHAR(500) NOT NULL,
    summary TEXT NOT NULL,
    cliffhanger TEXT,
    content TEXT,
    status VARCHAR(50) DEFAULT 'draft',
    word_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(project_id, chapter_index)
);

CREATE INDEX idx_chapters_project_id ON chapters(project_id);
CREATE INDEX idx_chapters_status ON chapters(status);
```

### Character States Table
```sql
CREATE TABLE character_states (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    chapter_id UUID REFERENCES chapters(id) ON DELETE CASCADE,
    character_name VARCHAR(255) NOT NULL,
    state JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_character_states_project_id ON character_states(project_id);
CREATE INDEX idx_character_states_chapter_id ON character_states(chapter_id);
```

### Audit Logs Table
```sql
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chapter_id UUID REFERENCES chapters(id) ON DELETE CASCADE,
    scores JSONB NOT NULL,
    issues JSONB NOT NULL,
    regeneration_hint TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_logs_chapter_id ON audit_logs(chapter_id);
```

## JSONB Structure Examples

### book_metadata
```json
{
  "title": "Mon Roman",
  "pitch": "Une histoire captivante...",
  "genre": "thriller",
  "targetAudience": "adult",
  "tone": "dark",
  "pov": "first-person",
  "targetLength": 80000,
  "inspirations": "Le Seigneur des Anneaux, Harry Potter"
}
```

### outline (array)
```json
[
  {
    "chapter_index": 1,
    "title": "Le Début",
    "summary": "Introduction du héros...",
    "cliffhanger": "Une découverte choquante",
    "status": "draft"
  }
]
```

### characters (array)
```json
[
  {
    "name": "Jean Dupont",
    "role": "protagonist",
    "initial_state": {
      "age": 35,
      "occupation": "boulanger",
      "location": "Paris",
      "health": 100,
      "motivation": "Venger sa famille"
    },
    "current_state": {
      "age": 35,
      "occupation": "boulanger",
      "location": "Londres",
      "health": 85,
      "motivation": "Venger sa famille"
    },
    "description": "Un homme de taille moyenne avec une cicatrice..."
  }
]
```

## Implementation Notes

1. **Current Implementation**: In-memory storage (Map) for demo purposes
2. **Production Implementation**: Replace with PostgreSQL using `pg` library
3. **Migration Strategy**: Use a migration tool like `node-pg-migrate` or `Prisma`
4. **Connection Pooling**: Implement connection pooling for better performance
5. **Backup Strategy**: Regular backups of project data and user information

## Future Enhancements

- Add full-text search on chapters
- Implement versioning for chapters (revision history)
- Add collaboration features (multiple users per project)
- Implement caching layer (Redis) for frequently accessed projects
