node {
    stage 'Checkout'
        sh 'pwd'
        git url: 'https://github.com/jbritton/guitar-vis.git'
        sh 'git log'
    stage 'Build'
        sh 'node -v'
        sh 'npm -v'
        sh 'cat package.json'
        sh 'npm install'
        sh 'npm run webpack'
    stage 'Test'
        echo 'Running unit test suites'
        echo 'Running integration test suites'
        echo 'Running static code analysis'
    stage 'Package'
        echo 'Generating project docs'
        echo 'Packaging artifact'
    stage 'Deploy'
        echo 'Deploying artifact'
        echo 'Notifying developers'
}
