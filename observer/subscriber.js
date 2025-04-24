import {send_course_content} from ".././config/Nodemailer.js";
export class UserSubscriber{
    constructor(user){
        this.user=user;
    }
    update(course){
        const newResource=course.resources[course.resources.lenght-1];
        if(newResource){
            send_course_content(this.user.email,course.tittle,newResource.type,newResource.url);
            
        }
    }
}