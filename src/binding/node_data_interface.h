#ifdef Zadeh_NODE_BINDING    // only defined for building the Node-js binding

#ifndef Zadeh_Node_DATA_INTERFACE_H
#define Zadeh_Node_DATA_INTERFACE_H

#include <napi.h>

#include "../data_interface.h"

namespace zadeh {

/** Napi::Array Data Interface */
template<>
Napi::Array init(const size_t len, const Napi::Env &env) {
    auto out = Napi::Array::New(env, len);
    return out;
}

template<>
string get_at(const Napi::Array &candidates, const size_t j) {
    return candidates.Get(j).ToString().Utf8Value();
}

template<>
Napi::Object get_at(const Napi::Array &candidates, const uint32_t j) {
    return candidates.Get(j).As<Napi::Object>();
}

template<>
size_t get_size(const Napi::Array &candidates) {
    return candidates.Length();
}

/** Napi::Object Data Interface */

template<>
Napi::Object init(const size_t len, const Napi::Env &env) {
    auto out = Napi::Object::New(env);
    return out;
}

template<>
CandidateString get_at(const Napi::Object &candidates, const string j) {
    return candidates.Get(j).ToString().Utf8Value();
}

template<>
void set_at(Napi::Array &candidates, const CandidateString &value, const size_t iCandidate) {
    candidates.Set(iCandidate, value);
}

/** Get the children of a tree_object (Napi::Object) */
template<>
optional<Napi::Array> get_children(const Napi::Object &tree_object, const string &children_key) {
    // determine if it has children
    if (tree_object.HasOwnProperty(children_key)) {
        const auto childrenRaw = tree_object.Get(children_key);
        if (childrenRaw.IsArray()) {
            const auto childrenArray = childrenRaw.As<Napi::Array>();
            if (childrenArray.Length() != 0) {
                return childrenArray;
            }
        }
    }
    return {};
}


}    // namespace zadeh
#endif
#endif
