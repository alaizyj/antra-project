const API = (() => {
    const URL = 'http://localhost:3000/events';

    const getEvents = () => {
        return fetch(URL).then((res) => res.json());
    };

    const postEvent = (newTodo) => {
        return fetch(URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newTodo),
        }).then((res) => res.json());
    };

    const removeEvent = (id) => {
        return fetch(`${URL}/${id}`, {
                method: 'DELETE',
            })
            .then((res) => res.json())
            .catch(console.log);
    };

    const updateEvent = (id, editedEvent) => {
        return fetch(`${URL}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editedEvent),
            })
            .then((res) => res.json())
            .catch(console.log);
    };

    return {
        getEvents,
        postEvent,
        removeEvent,
        updateEvent,
    };
})();

class eventModel {
    //all data
    _events;
    constructor() {
        this._events = {};
    }

    setEvents(events) {
        this._events = events;
    }

    getEvents() {
        return this._events;
    }

    updateEvent(id, status) {
        this._events[id]['status'] = status;
    }

    fetchEvents() {
        return API.getEvents()
            .then((events) => {
                const result = {};
                for (let i = 0; i < events.length; i++) {
                    const event = events[i];
                    const id = events[i]['id'];
                    const status = 'status';
                    event[status] = 'none';
                    result[id] = event;
                }
                this.setEvents(result);
                return result;
            })
            .catch((err) => console.log(err));
    }

    addEvent(event) {
        return API.postEvent(event).then((addedEvent) => {
            // console.log(addedEvent);
            const id = addedEvent['id'];
            addedEvent['status'] = 'none';
            this._events[id] = addedEvent;
            return addedEvent;
        });
    }

    removeEvent(id) {
        return API.removeEvent(id).then((removedTodo) => {
            delete this._events[id];
            return removedTodo;
        });
    }

    editEvent(id, newEvent) {
        return API.updateEvent(id, newEvent).then((editedEvent) => {
            editedEvent['status'] = 'none';
            this._events[id] = editedEvent;
            return editedEvent;
        });
    }
}
class eventView {
    //all dom elements
    constructor() {
        this.tableBody = document.querySelector('.table__body');
        this.addBtn = document.querySelector('.addBtn');
        this.errorMessage = document.querySelector('.error__message');
        // this.tableBody.addEventListener('submit', (e) => {
        //     e.preventDefault();
        // });
    }

    renderEvents(events) {
        const eventsHTML =
            Object.keys(events).length === 0 ?
            `<p class="empty-message">No events, try send one!</p>` :
            Object.keys(events)
            .map((key) => {
                return this.renderEvent(events[key]);
            })
            .join('');
        this.tableBody.innerHTML = eventsHTML;
    }

    renderEvent(event) {
        const id = event['id'];
        const idAttribute = 'row' + id;
        if (event['status'] === 'none') {
            return `
<tr id=${idAttribute}>
<td>${event['eventName']}</td>
<td>${event['startDate']}</td>
<td>${event['endDate']}</td>
<td><div class='buttons'>
<button data-id=${id} class='editBtn'><svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="EditIcon" aria-label="fontSize small"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"></path></svg></button>
<button data-id=${id} class='deleteBtn'><svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="DeleteIcon" aria-label="fontSize small"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path></svg></button>
</div></td>
</tr>
`;
        }

        if (event['status'] === 'edit') {
            return `
            <tr id=${idAttribute}>
            <td><input type='text' value="${event['eventName']}" class='title-input'  required/></td>
            <td><input type='date' value="${event['startDate']}" class='startdate-input' required/></td>
            <td><input type='date' value="${event['endDate']}" class='enddate-input' required /></td>
            <td><div class='buttons'>
            <button data-id=${id} class='saveBtn'><svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M21,20V8.414a1,1,0,0,0-.293-.707L16.293,3.293A1,1,0,0,0,15.586,3H4A1,1,0,0,0,3,4V20a1,1,0,0,0,1,1H20A1,1,0,0,0,21,20ZM9,8h4a1,1,0,0,1,0,2H9A1,1,0,0,1,9,8Zm7,11H8V15a1,1,0,0,1,1-1h6a1,1,0,0,1,1,1Z"/></svg></button>
            <button data-id=${id} class='cancelEditBtn'><svg focusable="false" aria-hidden="true" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M19.587 16.001l6.096 6.096c0.396 0.396 0.396 1.039 0 1.435l-2.151 2.151c-0.396 0.396-1.038 0.396-1.435 0l-6.097-6.096-6.097 6.096c-0.396 0.396-1.038 0.396-1.434 0l-2.152-2.151c-0.396-0.396-0.396-1.038 0-1.435l6.097-6.096-6.097-6.097c-0.396-0.396-0.396-1.039 0-1.435l2.153-2.151c0.396-0.396 1.038-0.396 1.434 0l6.096 6.097 6.097-6.097c0.396-0.396 1.038-0.396 1.435 0l2.151 2.152c0.396 0.396 0.396 1.038 0 1.435l-6.096 6.096z"></path></svg></button>
            </div></td>
            </tr>
            `;
        }
    }

    deleteEvent(id) {
        const eventEl = document.querySelector(`#row${id}`);
        eventEl.remove();
    }

    addEventView() {
        var tbody = document.getElementsByTagName('tbody')[0];
        const newRow = `
        <tr >
        <td><input type='text' class='title-input' required /></td>
        <td><input type='date' class='startdate-input'  required /></td>
        <td><input type='date' class='enddate-input' required /></td>
        <td><div class='buttons'>
        <button  class='addBtn__event'><svg focusable viewBox="0 0 24 24" aria-hidden="true xmlns="http://www.w3.org/2000/svg"><path d="M12 6V18M18 12H6" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
        <button  class='cancelAddBtn'><svg focusable="false" aria-hidden="true" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M19.587 16.001l6.096 6.096c0.396 0.396 0.396 1.039 0 1.435l-2.151 2.151c-0.396 0.396-1.038 0.396-1.435 0l-6.097-6.096-6.097 6.096c-0.396 0.396-1.038 0.396-1.434 0l-2.152-2.151c-0.396-0.396-0.396-1.038 0-1.435l6.097-6.096-6.097-6.097c-0.396-0.396-0.396-1.039 0-1.435l2.153-2.151c0.396-0.396 1.038-0.396 1.434 0l6.096 6.097 6.097-6.097c0.396-0.396 1.038-0.396 1.435 0l2.151 2.152c0.396 0.396 0.396 1.038 0 1.435l-6.096 6.096z"></path></svg></button>
        </div></td>
        </tr>
        `;
        tbody.insertRow().innerHTML = newRow;
    }
}
class eventController {
    constructor(view, model) {
        this.view = view;
        this.model = model;
        this.initialize();
    }

    initialize() {
        this.model.fetchEvents().then((result) => {
            this.view.renderEvents(result);
        });
        this.setUpEvents();
    }

    setUpEvents() {
            this.setUpDeleteEvent();
            this.setUpEditEvent();
            this.setUpCancelEditEvent();
            this.setUpAdd();
            this.setUpCancelAddEvent();
            this.setUpAddEvent();
            this.setUpSaveEvent();
        }
        //all event listeners

    setUpDeleteEvent() {
        this.view.tableBody.addEventListener('click', (e) => {
            if (e.target.classList.contains('deleteBtn')) {
                const id = e.target.dataset.id;
                this.model.removeEvent(id).then((data) => {
                    this.view.deleteEvent(id);
                });
            }
        });
    }

    setUpEditEvent() {
        this.view.tableBody.addEventListener('click', (e) => {
            if (e.target.classList.contains('editBtn')) {
                const id = e.target.dataset.id;

                this.model.updateEvent(id, 'edit');
                this.view.renderEvents(this.model._events);
            }
        });
    }

    setUpCancelEditEvent() {
        this.view.tableBody.addEventListener('click', (e) => {
            if (e.target.classList.contains('cancelEditBtn')) {
                const id = e.target.dataset.id;

                this.model.updateEvent(id, 'none');
                this.view.renderEvents(this.model._events);
            }
        });
    }

    setUpAdd() {
        this.view.addBtn.addEventListener('click', (e) => {
            if (e.target.classList.contains('addBtn')) {
                this.view.addEventView();
            }
        });
    }

    setUpCancelAddEvent() {
        this.view.tableBody.addEventListener('click', (e) => {
            if (e.target.classList.contains('cancelAddBtn')) {
                e.preventDefault();
                this.view.renderEvents(this.model._events);
            }
        });
    }
    setUpAddEvent() {
        this.view.tableBody.addEventListener('click', (e) => {
            if (e.target.classList.contains('addBtn__event')) {
                e.preventDefault();
                const eventName = document.querySelector('.title-input').value;
                const startDate = document.querySelector('.startdate-input').value;
                const endDate = document.querySelector('.enddate-input').value;
                const code = this.validate(eventName, startDate, endDate);

                this.handleError(code);
                if (code != 0) {
                    return;
                }

                this.model
                    .addEvent({
                        eventName,
                        startDate,
                        endDate,
                    })
                    .then((data) => {
                        this.view.renderEvents(this.model._events);
                    });
            }
        });
    }

    setUpSaveEvent() {
        this.view.tableBody.addEventListener('click', (e) => {
            if (e.target.classList.contains('saveBtn')) {
                const id = e.target.dataset.id;
                const eventName = document.querySelector('.title-input').value;
                const startDate = document.querySelector('.startdate-input').value;
                const endDate = document.querySelector('.enddate-input').value;

                const code = this.validate(eventName, startDate, endDate);
                this.handleError(code);
                if (code != 0) {
                    return;
                }

                this.model
                    .editEvent(id, {
                        eventName,
                        startDate,
                        endDate,
                    })
                    .then((data) => {
                        this.view.renderEvents(this.model._events);
                    });
            }
        });
    }

    validate(title, start, end) {
        if (!title || !start || !end) {
            return 2;
        }
        if (!/^[A-Za-z0-9]*$/.test(title)) {
            return 1;
        }
        return 0;
    }

    handleError(errorCode) {
        if (errorCode === 1) {
            this.view.errorMessage.textContent =
                'Event Name should consist of only letters and digits!';
            return;
        }

        if (errorCode === 2) {
            this.view.errorMessage.textContent = 'Input fields cannot be empty!';
            return;
        }
        if (errorCode === 0) {
            this.view.errorMessage.textContent = '';
            return;
        }
    }
}

const view = new eventView();
const model = new eventModel();
const controller = new eventController(view, model);