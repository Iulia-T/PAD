# Lab 1: Web Proxy
_Realized by: Iulia Țăruș, FAF-202_
## Topic: Online Food Ordering
Within this laboratory work, I would implement a project with 2 microservices: _Menu Service_ and _Order Service_

### Assess Application Suitability
Why does implementing microservices is a good fit to my project:
- __Task Division__: the project has enough components to be divided in smaller modules. Moreover, service separation is needed in such a project to make the code look good and the application to work efficiently.
- __Technology diversity__: microservices will be implemented using different programming languages: Java and Python.
- __Independent modules__: the project will be divided in smaller modules that will be developed and scaled separately, without impacting other components. Moreover, independent modules are also fault isolated, so if a service fails, the other ones won't be affected.
- __Scalability__: other modules can be added to the project without impacting existing features, as well as third-party services can be integrated
- __Resource Management__: usually, services need different amount of resources, such as memory, CPU power, etc. So, those resources could be dinamically allocated between services depending on necessities.

In the Software Industry, an application with similar functionalities of online platform for product ordering (but much more complex) is Amazon. While scaling, they've divided their architecture into microservices not only for major tasks, but they separated everything into such small microserrvices as one for Buy button.

### Define Service Boundaries
The functionalities of each service are described in the architecture diagram:
![architecture diagram](https://github.com/Iulia-T/PAD/blob/main/architecture%20diagram.jpg?raw=true)

### Choose Technology Stack and Communication Patterns
__Menu Service:__
- Programming Language: _Java_
- Framework: _Spring Boot_
 
__Order Service:__
- Programming Language: _Python_
- Framework: _Flask_
 
Inter-service communication will be performed synchronously (RESTful APIs). This approach ensures real-time responses, which is needed in the case of implemented microservices, as none of those 2 has to run in background.

### Design Data Management
Data will be accessed by separate APIs.

__Menu Service:__
- Create Item
  - Request: JSON
  - Response: Status Code (201)
- Update Item
  - Request: JSON
  - Response: Status Code (200)
- Get Item
  - Response: JSON
- Delete Item
  - Request: JSON
  - Response: Status Code (204)

\
__Order Service:__
- Create Order
  - Request: JSON
  - Response: Status Code (201)
- Update Order
  - Request: JSON
  - Response: Status Code (200)
- Get Details
  - Response: JSON
- Cancel Order
  - Request: JSON
  - Response: Status Code (204)

### Set Up Deployment and Scaling
I will containeraize the project, using Docker, to ease the packaging, distributing and running it across different envoironments, as well as versioning the content. There is no need to orchestrate it, as, for now, the project is a simple one with few microservices, but, if I'll plan to scale it, I'll deffinitely orchestrate it to automate deployment, scaling, load balancing, self-healing and to reduce operational overhead