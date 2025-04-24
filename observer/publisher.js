 export class CoursePublisher {
    constructor() {
        this.subscribers = [];
    }

    addSubscriber(user) {
        this.subscribers.push(user);
    }

    notify(course) {
        this.subscribers.forEach(subscriber => {
            subscriber.update(course);
        });
    }
}


