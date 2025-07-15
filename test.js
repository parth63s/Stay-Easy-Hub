import http from 'k6/http';
import { sleep } from 'k6';

export let options = {
    vus: 50, // 50 users
    duration: '30s', // Run test for 30 seconds
};

export default function () {
    http.get('http://localhost:8080/');  // Homepage
    http.get('http://localhost:8080/about');  // About page
    http.get('http://localhost:8080/contact');  // Contact page
    sleep(1);
}
