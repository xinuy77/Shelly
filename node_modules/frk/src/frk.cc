#include <nan.h>
#include <unistd.h>
#include <sys/wait.h>
using namespace std;

using v8::FunctionTemplate;
using Nan::GetFunction;
using Nan::Set;
using v8::Function;
using v8::Local;
using v8::Value;
using v8::String;
using v8::Integer;
using Nan::AsyncQueueWorker;
using Nan::AsyncWorker;
using Nan::Callback;
using Nan::New;
using Nan::To;

class CaringParent : public AsyncWorker {
public:
  CaringParent(Callback *done, pid_t pid): AsyncWorker(done), done(done), pid(pid) {}

  ~CaringParent() {}

  void Execute() {
    int status;
    waitpid(pid, &status, 0);
    exitCode = WEXITSTATUS(status);
  }

  void HandleOKCallback () {
    Local<Value> v = New<Integer>(exitCode);
    Local<Value> argv[] = {v};
    done->Call(1, argv, async_resource);
  }

private:
  Callback *done;
  pid_t pid;
  int exitCode;
};


NAN_METHOD(Frk) {
  Callback *done = new Callback(To<Function>(info[0]).ToLocalChecked());
  Local<Function> child = info[1].As<Function>();
  pid_t pid = fork();
  if (pid) {
    info.GetReturnValue().Set(New(pid));
    AsyncQueueWorker(new CaringParent(done, pid));
  }else {
    Local<Value> argv[] = {};
    Nan::MakeCallback(Nan::GetCurrentContext()->Global(), child, 0, argv);
    exit(10);
  }
}

NAN_MODULE_INIT(InitAll) {
  Set(
    target,
    New<String>("run").ToLocalChecked(),
    GetFunction(New<FunctionTemplate>(Frk)).ToLocalChecked()
  );
}


NODE_MODULE(addon, InitAll)