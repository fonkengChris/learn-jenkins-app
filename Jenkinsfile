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
        stage('E2E') {
            agent {
                docker {
                    image 'mcr.microsoft.com/playwright:v1.39.0-focal'
                    reuseNode true
                    // args '-u root:root'
                }
            }
            
            steps {
                sh '''
                    npm install serve --save-dev
                    npx serve -s build &
                    echo "Waiting for server to start..."
                    # Wait for the server to be ready
                    for i in $(seq 1 30); do
                        if curl -s http://localhost:3000 >/dev/null; then
                            echo "Server is up!"
                            break
                        fi
                        echo "Waiting... ($i/30)"
                        sleep 1
                    done
                    
                    # Run the tests
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
