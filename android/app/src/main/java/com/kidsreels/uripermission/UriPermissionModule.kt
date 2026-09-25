package com.kidsreels.uripermission

import android.content.Intent
import android.net.Uri
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class UriPermissionModule(
  private val reactContext: ReactApplicationContext,
) : ReactContextBaseJavaModule(reactContext) {

  override fun getName(): String = "UriPermissionModule"

  @ReactMethod
  fun takePersistableReadPermission(uriString: String, promise: Promise) {
    try {
      val uri = Uri.parse(uriString)
      reactContext.contentResolver.takePersistableUriPermission(
        uri,
        Intent.FLAG_GRANT_READ_URI_PERMISSION,
      )
      promise.resolve(true)
    } catch (error: SecurityException) {
      // Picker may not grant persistable flags (common with ACTION_PICK). App still works for session.
      promise.resolve(false)
    } catch (error: Exception) {
      promise.reject("URI_PERMISSION_ERROR", error.message, error)
    }
  }
}
