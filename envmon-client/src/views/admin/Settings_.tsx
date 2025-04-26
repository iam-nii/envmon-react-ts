import SetRegulations from "../../components/settings/SetRegulations";
import EditRegulations from "../../components/settings/EditRegulations";
import SetNotifications from "../../components/settings/SetNotifications";
import SetRequestInterval from "../../components/settings/SetRequestInterval";
function Settings() {
  return (
    <div className="flex flex-col gap-5 w-[80%] mx-auto mt-10">
      <div className="flex flex-col">
        <SetRegulations />
      </div>
      <div className="flex flex-col">
        <EditRegulations />
      </div>
      <div className="flex flex-col">
        <SetNotifications />
      </div>
      <div className="flex flex-col gap-5">
        <SetRequestInterval />
      </div>
    </div>
  );
}

export default Settings;
