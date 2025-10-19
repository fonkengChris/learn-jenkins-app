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
                    # Fix ownership of all files to current user
                    chown -R $(id -u):$(id -g) . || true
                    npm install
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
                    # Fix ownership of all files to current user
                    chown -R $(id -u):$(id -g) . || true
                    npm install
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
                    # Fix ownership of all files to current user
                    chown -R $(id -u):$(id -g) . || true
                    npm install
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
