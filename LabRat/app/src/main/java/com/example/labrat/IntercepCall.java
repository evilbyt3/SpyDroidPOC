package com.example.labrat;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.telephony.PhoneStateListener;
import android.telephony.TelephonyManager;
import android.util.Log;
import android.widget.Toast;

public class IntercepCall extends BroadcastReceiver {
    private Context mContext;


    @Override
    public void onReceive(Context context, Intent intent) {
        mContext = context;
        TelephonyManager telephony = (TelephonyManager)context.getSystemService(Context.TELEPHONY_SERVICE);
        CustomPhoneStateListener customPhoneListener = new   CustomPhoneStateListener();
        telephony.listen(customPhoneListener, PhoneStateListener.LISTEN_CALL_STATE);
        Bundle bundle = intent.getExtras();
        String phoneNr= bundle.getString("incoming_number");
        Log.i("TEST", phoneNr);
    }


    public class CustomPhoneStateListener extends PhoneStateListener {
        private static final String TAG = "CustomPhoneStateListener";

        @Override
        public void onCallStateChanged(int state, String incomingNumber)
        {
            switch (state)
            {
                case TelephonyManager.CALL_STATE_RINGING:
                    if(!incomingNumber.equalsIgnoreCase("")) {
                        Log.i("TEST", "CALL_STATE_RINGING");
                    }
                    break;

                case TelephonyManager.CALL_STATE_OFFHOOK:
                    Log.i("TEST", "CALL_STATE_OFFHOOK");
                    break;

                case TelephonyManager.CALL_STATE_IDLE:
                    Log.i("TEST", "CALL_STATE_IDLE");
                    break;

                default:
                    break;
            }
            super.onCallStateChanged(state, incomingNumber);
        }
    }
}
