## Event Scraper for EventHub

## Functionality required
* Fetch events from all page-ids
* Fetch events from a page-id
* Fetch an event from an event-id
* Write to Firebase db

### Flow ( 'general' from page-id )
* Get all page-ids (stored in a seperate file)
* LOOP on all page-ids
    * Open page events
    * Get Upcoming events, Past events
    * LOOP on all events
        * Get all Details
            * Name
            * Date
            * Image
            * Location
            * (Organiser and college already known)
        * Store in proper format in some local db (as soon as they are fetched)
        * Mark inserted or updated events ( so that only these are pushed to firebase later..)
    