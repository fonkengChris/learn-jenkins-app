pipeline {
    agent any

    stages {
        stage('Build') {
            agent {
                docker {
                    image 'node:18-alpine'
                    reuseNode true
                }
            }
            steps {
                sh '''
                    ls -la
                    node --version
                    npm --version
                    npm ci
                    npm run build
                    ls -la 
                '''
            }
        }
        
        stage('Test') {
            agent {
                docker {
                    image 'node:18-alpine'
                    reuseNode true
                }
            }
            steps {
                sh '''
                     # Clean install dependencies
                     # rm -rf node_modules package-lock.json
                     # npm ci
                    # Run unit tests and generate JUnit report
                    npm test -- --watchAll=false --testResultsProcessor="jest-junit"
                '''
            }
            post {
                always {
                    publishTestResults testResultsPattern: 'test-results/junit.xml'
                }
            }
        }
        
        stage('E2E') {
            agent {
                docker {
                    image 'mcr.microsoft.com/playwright:v1.39.0-focal'
                    reuseNode true
                }
            }
            
            steps {
                sh '''
                    # Install project dependencies
                    npm ci
                    
                    npm install serve
                    
                    serve -s build -l 3000 &
                    echo "Waiting for server to start..."
                   
                    # Wait for the server to be ready
                    // for i in $(seq 1 30); do
                    //     if curl -s http://localhost:3000 >/dev/null; then
                    //         echo "Server is up!"
                    //         break
                    //     fi
                    //     echo "Waiting... ($i/30)"
                    //     sleep 1
                    // done
                    
                    # Run the Playwright tests
                    npx playwright test
                '''
            }
            post {
                always {
                    publishTestResults testResultsPattern: 'test-results/junit.xml'
                }
            }
        }
    }

    
}
