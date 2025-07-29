BenchSync:
AI-Powered Pool Consultant Management System
A submission for the Mavericks Hackathon Program 2026 by Team Hexatrons.

BenchSync is an intelligent, scalable platform designed to streamline the management of bench consultants at Hexaware. It leverages a suite of Generative AI agents to automate tracking, enhance upskilling, and optimize project allocation, transforming the bench from a cost center into a strategic talent pool.
Team Details

Team Name: Hexatrons 

Application Name: BenchSync 

Team Members and thier roles:

Naveender M – Backend Development 

Sanjay N - Gen AI Integration and Development 

Kishore A M - FrontEnd Development 

HariHaran K - Project Management and System Design 

Problem Statement
Managing a pool of consultants on the bench is a complex challenge. Traditional methods lead to inefficiencies, including outdated skill records, poor attendance tracking for meetings, and a lack of insight into opportunities provided during bench periods. This results in underutilized talent and a reactive approach to project staffing.

Proposed Solution
BenchSync addresses these challenges with a multi-agent AI framework that provides real-time visibility and automation for both consultants and administrators. 



Automates tracking and reporting for bench consultants. 


Enhances training, readiness, and project assignment. 


Minimizes manual HR efforts and inaccuracies. 


Boosts consultant engagement and visibility. 


Facilitates more informed, analytics-based decision-making. 

Key Features
The system is powered by a set of specialized AI agents working in concert: 


Resume Agent: Extracts and maintains up-to-date skill vectors from resumes using OpenAI's Embedding API. 




Attendance Agent: Automatically gathers and compiles data on meeting attendance from sources like Microsoft Teams. 


Training Agent: Suggests personalized training programs using GPT-4 to fill identified skill gaps. 



Opportunity Agent: Matches consultants to available project roles using advanced semantic reasoning with a fine-tuned LLaMA 3 model. 



Summary Agent: Generates concise weekly progress snapshots for consultants and managers using Gemini 1.5. 



Sentiment Agent: Analyzes consultant morale and engagement levels to provide qualitative insights. 

System Architecture
BenchSync is built on a modern, domain-driven microservices architecture, ensuring modularity, scalability, and resilience.




Frontend: A responsive React application provides role-based dashboards for consultants and administrators. 



Backend: A robust Spring Boot application handles business logic, workflow orchestration, and secure communication with the AI agents via REST APIs. 



AI Agents: Independent Flask microservices, each powered by a specific Generative AI model, handle specialized tasks. 



Database: A secure PostgreSQL database stores all consultant profiles, skill vectors, and transaction logs, with data encrypted at rest and in transit. 



Infrastructure: The entire system is containerized with Docker and deployed on AWS (ECS/EKS) for elastic scaling and high availability. 


Technologies Used
Category	Technology	Version/Details
Frontend	
React

v18+ for dynamic, responsive UI. 

Backend	
Spring Boot

v3.2+ for core logic and REST APIs. 

AI Agents	
Flask, OpenAI API, LLaMA 3, Gemini 1.5

v2.3+, hosts specialized AI microservices. 

Database	
PostgreSQL

v15, for encrypted and audited data storage. 

DevOps	
Docker, AWS ECS/EKS, Prometheus/ELK

v24+, for containerization, scalable deployment, and monitoring. 


Security	JWT, Spring Security, mTLS	
Zero-Trust model with Role-Based Access Control. 




Export to Sheets
How It Works

Consultant Interaction: Consultants log in to their dashboard to update their resume, view training progress, track attendance, and see recent opportunities. 


Backend Orchestration: The Spring Boot backend receives requests, authenticates them using JWT, and routes tasks to the appropriate AI agent. 

AI Processing:

The 

Resume Agent parses the resume, updates the skill vector, and saves it to the database. 


The 

Training Agent identifies skill gaps and recommends relevant courses. 


The 

Opportunity Agent matches the consultant's profile against open roles. 


The 

Summary Agent generates a weekly report of the consultant's activities. 



Admin Oversight: Administrators use their dashboard to search for consultants, generate reports, and monitor the overall health of the consultant pool. 


Innovation and Creativity

Agent-as-a-Service Model: Each AI agent is a plug-and-play microservice, allowing for easy extension and maintenance. 


Live Consultant Readiness Score: An AI-calculated composite score assesses a consultant's project-readiness based on their resume, training, and engagement. 


Gamified Reward System: Consultants are rewarded for their participation in meetings and training completion, boosting engagement. 


Intent-Aware Project Matching: The Opportunity Agent learns a consultant's career intent from their actions, leading to more meaningful project alignments. 


Zero-Click AI Reporting: Managers receive automated weekly summaries, eliminating the need for manual data entry. 

Performance and Scalability

Scalability: Horizontally scalable microservices on AWS support 10,000+ users and 1,000+ concurrent sessions. 



High-Speed Performance: APIs deliver sub-400ms average response times, and AI agents can process over 150 resumes per hour. 




Elastic Observability: Integrated monitoring provides real-time logs, metrics, and anomaly detection to ensure high uptime (99.5% target) and system health. 


Security
The platform is built on a 

Zero-Trust Security Architecture: 



Secure Access: Role-Based Access Control (RBAC) is enforced using JWT with fine-scoped claims. 




Encrypted Traffic: Mutual TLS (mTLS) is used for all internal service-to-service communication. 



Data Protection: All data is encrypted at rest and in transit, with full audit logging enabled to meet compliance standards. 

Live Console Output
Here is a snapshot of the system in action, showing logs from the backend and various AI agents processing data for consultant_124.

SpringBoot Backend & Resume Agent:



Training, Attendance, Opportunity & Summary Agents:
