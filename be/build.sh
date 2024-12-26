rm -rf src/main/resources/static

cd ../fe
# index, js 파일 압축
npm run build

# js 파일을 static 폴더로 이동
mv dist ../be/src/main/resources/static

cd ../be

./gradlew bootJar

scp -i src/main/resources/secret/key1121.pem build/libs/be-0.0.1-SNAPSHOT.jar ubuntu@3.36.96.253:./pj.jar
ssh -i src/main/resources/secret/key1121.pem ubuntu@3.36.96.253 './run.sh'