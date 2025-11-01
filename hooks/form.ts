import {
  createFormHook,
  createFormHookContexts,
  revalidateLogic,
} from "@tanstack/react-form";

// Components
import TextField from "@/components/Form/text-field";
import PasswordField from "@/components/Form/password-field";
import SubscribeButton from "@/components/Form/subscribe-button";

// Hooks
export const { fieldContext, useFieldContext, formContext, useFormContext } =
  createFormHookContexts();

export const { useAppForm, withForm } = createFormHook({
  fieldComponents: {
    TextField,
    PasswordField,
  },
  formComponents: {
    SubscribeButton,
  },
  fieldContext,
  formContext,
});
