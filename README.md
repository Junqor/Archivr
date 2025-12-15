# Archivr
Group F for CSci 150 Fall 2024

<img width="800" alt="image" src="https://github.com/user-attachments/assets/dcf5014d-8dc8-445f-bf65-16a89edb5694" />
<br/><br/>

## Project Description:
	
Archivr is a website that serves a one-stop hub for tracking, rating, and discussing your favorite movies and TV. It allows you to share your thoughts, join discussions, and discover new favorites based on personalized recommendations.
<br/><br/>

## Features

### Profiles
Customize your profile to reflect yourself and your interests. Check out user profiles with similar interests.

<img width="800" alt="image" src="https://github.com/user-attachments/assets/fa58f18b-ea80-461b-b147-7ee51a455987" />

### Search
Forgot what that one movie was called? Just type in a word you remember and our search can help you find it

<img width="800" alt="image" src="https://github.com/user-attachments/assets/b5631489-1928-4405-b50a-617389f3c6ad" />

### Reviews
Rate media based on your enjoyment and write a review to share your thoughts with others. Like reviews you enjoy.

<img width="685" alt="image" src="https://github.com/user-attachments/assets/36aebaa9-9682-4e70-99ea-7c24f83a71f8" />

### Status Tracking
Track media status by adding it to your personal watchlists.

<img width="239" alt="image" src="https://github.com/user-attachments/assets/f1a3a2ef-ce6a-4fe7-80d3-c215851daed2" />

### Watch 
See where you can watch media in your prefered form, whether it be owning or streaming. Filter by country.

<img width="236" alt="image" src="https://github.com/user-attachments/assets/c34e144e-f18e-4395-9709-2d9c33a7d18b" />
<br/><br/>

# Development Setup
## Prerequisites
- Node.js (v14 or higher)
- Docker

## Setup
1. To run the development environment with a local database, use Docker Compose:
   ```bash
   docker compose up
   ```
2. To migrate the database schema run the following command from the backend directory:
   ```bash
   npx drizzle-kit push
   ```
> [!NOTE]
> You must have the db connection variables in `.env`:
> ```env
> DB_HOST=localhost
> DB_NAME=archivr
> DB_USER=user
> DB_PASSWORD=password
3. Populate the db with movie data using the tvdb scripts from [populate-tvdb-movies-series](https://github.com/Junqor/populate-tvdb-movies-series).
4. Access the application at `http://localhost:5173`.
5. `docker compose down` to stop the development environment. `docker compose down -v` to remove the database and s3 volumes.

## Team Members:

- Roberto Ramirez
- Nicholas Rodriguez :Nick Commit :D!
- Joshua Andrew Sullivan
- Jose Cortes
- Ulysses Ochoa
- Saul Martinez Valencia
