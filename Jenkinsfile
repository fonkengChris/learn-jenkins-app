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
                    # Clean node_modules to avoid permission issues
                    rm -rf node_modules
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
                    # Clean node_modules to avoid permission issues
                    rm -rf node_modules
                    npm ci
                    npm test -- --watchAll=false --testResultsProcessor="jest-junit"
                '''
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
                    # Clean node_modules to avoid permission issues
                    rm -rf node_modules
                    npm ci
                    npm install serve
                    node_modules/.bin/serve -s build &
                    sleep 10
                    npx playwright test
                '''
            }
        }
    }

    post {
        always {
            junit 'test-results/junit.xml'
        }
    }
}
